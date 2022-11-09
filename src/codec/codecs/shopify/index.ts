import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, CommonArgs } from '../../../common/types'
import { CodecPropertyConfig, CommerceCodec, registerCodec, StringProperty } from '../..'
import { ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, OAuthRestClient, UsernamePasswordConfiguration, UsernamePasswordProperties } from '../../..'
import { CodecType } from '../../index'
import { findInMegaMenu } from '../common'
import slugify from 'slugify'
import btoa from 'btoa'
import { formatMoneyString } from '../../../common/util'
import { SFCCProduct } from '../sfcc/types'

type CodecConfig = UsernamePasswordConfiguration & ClientCredentialsConfiguration

const properties: CodecConfig = {
	...UsernamePasswordProperties,
	...ClientCredentialProperties
}

const shopifyCodec: CommerceCodec = {
	metadata: {
		type: CodecType.commerce,
		properties,
		vendor: 'shopify'
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

		let categories: Category[] = await fetch('/categories?limit=100')
		categories = _.concat(categories, await fetch('/categories?limit=100&page=2'))
		categories = _.concat(categories, await fetch('/categories?limit=100&page=3'))

		const mapCategory = (category: Category): Category => ({
			...category
		})

		const findValue = (values: any[]) => values && values.find(value => !value.locale || value.locale === 'en_US')?.data

		const mapProduct = (args: CommonArgs) => (product: Product): Product => {
			return product
		}

		// 'master' is the catalog root node, so top-level categories its children
		let megaMenu: Category[] = []

		megaMenu = findInMegaMenu(megaMenu, 'master').children

		const api = {
			getProductById: (args: CommonArgs) => async (id: string): Promise<Product> => {
				// return mapProduct(args)(await fetch(`/products/${id}`))
				return null
			},
			getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
				// return await api.getProductById(args)(args.id)
				return null
			},
			getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
				// if (args.productIds) {
				//     return await Promise.all(args.productIds.split(',').map(api.getProductById(args)))
				// }
				// else if (args.keyword) {
				//     let searchResults = await fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`)
				//     return searchResults.map(mapProduct(args))
				// }
				// else if (args.category) {
				//     let products = await fetch(`/products?search={"categories":[{"operator":"IN","value":["${args.category.id}"]}]}`)
				//     return products.map(mapProduct(args))
				// }
				return []
			},
			getCategory: async (args: GetCommerceObjectArgs) => {
				return null
			},
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
registerCodec(shopifyCodec)