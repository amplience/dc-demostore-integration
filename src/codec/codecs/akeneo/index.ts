import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, CommonArgs } from '../../../common/types'
import { CodecPropertyConfig, CommerceCodec, registerCodec, StringProperty } from '../..'
import { ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, OAuthRestClient, UsernamePasswordConfiguration, UsernamePasswordProperties } from '../../..'
import { CodecType } from '../../index'
import { findInMegaMenu } from '../common'
import slugify from 'slugify'
import btoa from 'btoa'
import { AkeneoCategory, AkeneoProduct, AkeneoProperty } from './types'
import { formatMoneyString } from '../../../common/util'
import { SFCCProduct } from '../sfcc/types'

type CodecConfig = UsernamePasswordConfiguration & ClientCredentialsConfiguration

const properties: CodecConfig = {
	...UsernamePasswordProperties,
	...ClientCredentialProperties
}

const akeneoCodec: CommerceCodec = {
	metadata: {
		type: CodecType.commerce,
		properties,
		vendor: 'akeneo'
	},
	getAPI: async function (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		const rest = OAuthRestClient({
			api_url: `${config.api_url}/api/rest/v1`,
			auth_url: `${config.api_url}/api/oauth/v1/token`
		}, {
			username: config.username,
			password: config.password,
			grant_type: 'password'
		}, {
			headers: {
				Authorization: `Basic ${btoa(`${config.client_id}:${config.client_secret}`)}`
			}
		}, (auth: any) => ({
			Authorization: `Bearer ${auth.access_token}`
		}))
		const fetch = async url => {
			try {
				const result = await rest.get({ url })
				return result._embedded ? result._embedded.items : result
			} catch (error) {
				console.log(`error url [ ${url} ]`)                
			}
		}

		let categories: AkeneoCategory[] = await fetch('/categories?limit=100')
		categories = _.concat(categories, await fetch('/categories?limit=100&page=2'))
		categories = _.concat(categories, await fetch('/categories?limit=100&page=3'))

		const mapCategory = (category: AkeneoCategory): Category => ({
			id: category.code,
			name: category.labels['en_US'],
			slug: category.code,
			children: [],
			products: []
		})

		const findValue = (values: AkeneoProperty[]) => values && values.find(value => !value.locale || value.locale === 'en_US')?.data

		const mapProduct = (args: CommonArgs) => (product: AkeneoProduct): Product => {
			const prices = findValue(product.values.price)
			let price = '--'

			if (prices) {
				const locationPrice = prices.find(p => p.currency === args.currency)
				if (locationPrice) {
					price = formatMoneyString(locationPrice.amount, args)
				}
			}

			return {
				id: product.identifier,
				name: findValue(product.values.name),
				slug: product.values.name && slugify(findValue(product.values.name), { lower: true }),
				shortDescription: findValue(product.values.description),
				longDescription: findValue(product.values.description),
				categories: [],
				variants: [{
					sku: product.identifier,
					listPrice: price,
					salePrice: price,
					// images: [],
					images: [{ url: `https://assets.ellosgroup.com/s/ellos/ell_${product.identifier}_MS` }],
					attributes: _.mapValues(product.values, findValue)
				}]
			}
		}

		// 'master' is the catalog root node, so top-level categories its children
		let megaMenu: Category[] = []
		categories.forEach(cat => {
			if (cat.code === 'master') {
				// top level category
				megaMenu.push(mapCategory(cat))
			}
			else {
				// try to find in the megamenu
				const parent = findInMegaMenu(megaMenu, cat.parent)
				if (parent) {
					parent.children.push(mapCategory(cat))
				}
			}
		})

		megaMenu = findInMegaMenu(megaMenu, 'master').children

		const api = {
			getProductById: (args: CommonArgs) => async (id: string): Promise<Product> => {
				return mapProduct(args)(await fetch(`/products/${id}`))
			},
			getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
				return await api.getProductById(args)(args.id)
			},
			getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
				if (args.productIds) {
					return await Promise.all(args.productIds.split(',').map(api.getProductById(args)))
				}
				else if (args.keyword) {
					const searchResults = await fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`)
					return searchResults.map(mapProduct(args))
				}
				else if (args.category) {
					const products = await fetch(`/products?search={"categories":[{"operator":"IN","value":["${args.category.id}"]}]}`)
					return products.map(mapProduct(args))
				}
			},
			getCategory: async (args: GetCommerceObjectArgs) => {
				return await api.populateCategory(findInMegaMenu(megaMenu, args.slug), args)
			},
			populateCategory: async (category: Category, args: CommonArgs): Promise<Category> => ({
				products: await api.getProducts({ category, ...args }),
				...category
			}),
			getMegaMenu: async (): Promise<Category[]> => {
				return megaMenu
			},
			getCustomerGroups: async (): Promise<CustomerGroup[]> => {
				return []
			},
			getVariants: async (): Promise<SFCCProduct> => {
				return
			}
		}
		return api
	}
}
registerCodec(akeneoCodec)