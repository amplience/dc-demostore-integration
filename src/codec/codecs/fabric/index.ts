import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, CommonArgs } from '../../../common/types'
import { CodecPropertyConfig, CodecType, CommerceCodec, registerCodec, StringProperty } from '../..'
import { CommerceAPI, UsernamePasswordConfiguration, UsernamePasswordProperties } from '../../..'
import OAuthRestClient, { OAuthCodecConfiguration, OAuthProperties } from '../../../common/rest-client'
import slugify from 'slugify'
import { findInMegaMenu } from '../common'
import { Attribute, FabricCategory, FabricProduct } from './types'
import { SFCCProduct } from '../sfcc/types'

type CodecConfig = OAuthCodecConfiguration & UsernamePasswordConfiguration & {
    accountId:  StringProperty
    accountKey: StringProperty
    stage:      StringProperty
}

const properties: CodecConfig = {
	...OAuthProperties,
	...UsernamePasswordProperties,
	accountId: {
		title: 'Account ID',
		type: 'string'
	},
	accountKey: {
		title: 'Account Key',
		type: 'string'
	},
	stage: {
		title: 'Stage',
		type: 'string'
	}
}

const fabricCodec: CommerceCodec = {
	metadata: {
		type:   CodecType.commerce,
		vendor: 'fabric',
		properties
	},
	getAPI: async (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> => {
		const rest = OAuthRestClient(config, config, {
			headers: {
				'content-type': 'application/json'
			}
		}, (auth: any) => {
			return {
				Authorization: auth.accessToken,

				// todo: what comprises site-context?
				// todo: what do we need to remove (abstract) from here?  account?  stage?
				'x-site-context': JSON.stringify({
					stage: config.stage,
					account: config.accountKey,
					date: new Date().toISOString(),
					channel: 12
				})
			}
		})
		const fetch = async url => await rest.get({ url })

		const getProductAttributes = async function (sku: string): Promise<Attribute[]> {
			return _.get(await fetch(`/api-product/v1/product/attribute?sku=${sku}`), 'attributes')
		}

		const getProductsForCategory = async function (category: Category): Promise<Product[]> {
			const skus = _.take(_.get(await fetch(`/api-category/v1/category/sku?id=${category.id}`), 'skus'), 20)
			return _.isEmpty(skus) ? [] : await getProducts({ productIds: skus.join(',') })
		}

		const mapCategory = (category: FabricCategory): Category => ({
			id: category.id,
			slug: slugify(category.name, { lower: true }),
			name: category.name,
			children: category.children.map(mapCategory),
			products: []
		})

		const mapProduct = async (product: FabricProduct): Promise<Product> => {
			const attributes = await getProductAttributes(product.sku)
			const getAttributeValue = name => attributes.find(att => att.name === name).value

			const name = getAttributeValue('title')
			return {
				id: product._id,
				name,
				longDescription: getAttributeValue('description'),
				slug: slugify(name, { lower: true }),
				categories: [],
				variants: [{
					sku: product.sku,
					listPrice: '--',
					salePrice: '--',
					images: [
						{ url: getAttributeValue('Image 1') },
						...JSON.parse(getAttributeValue('ImageArray'))
					],
					attributes: _.zipObject(_.map(attributes, 'name'), _.map(attributes, 'value'))
				}]
			}
		}

		// the 'categories[0].children' of the node returned from this URL are the top level categories
		const categories: any[] = _.get(await fetch('/api-category/v1/category?page=1&size=1&type=ALL'), 'categories[0].children')
		if (!categories) {
			throw new Error('megaMenu node not found')
		}

		const megaMenu = categories.map(mapCategory)

		// CommerceAPI implementation
		const getProduct = async function (args: GetCommerceObjectArgs): Promise<Product> {
			return _.first(await getProducts({ productIds: args.id }))
		}

		const getProducts = async function (args: GetProductsArgs): Promise<Product[]> {
			const url = args.productIds ? `/api-product/v1/product/search?size=${args.productIds.split(',').length}&page=1&query=${args.productIds}` : `/api-product/v1/product/search?size=12&page=1&query=${args.keyword}`
			const products = _.get(await fetch(url), 'products')
			return await Promise.all(products.map(mapProduct))
		}

		const getCategory = async function (args: GetCommerceObjectArgs): Promise<Category> {
			const category = findInMegaMenu(await getMegaMenu(args), args.slug)
			return {
				...category,
				products: await getProductsForCategory(category)
			}
		}

		const getMegaMenu = async function (args: CommonArgs): Promise<Category[]> {
			return megaMenu
		}

		const getCustomerGroups = async function (args: CommonArgs): Promise<CustomerGroup[]> {
			// i think these will live here: https://sandbox.copilot.fabric.inc/api-identity/tags/get
			return []
		}

		const getVariants = async (): Promise<SFCCProduct> => {
			return
		}
		// end CommerceAPI implementation

		return {
			getProduct,
			getProducts,
			getCategory,
			getMegaMenu,
			getCustomerGroups,
			getVariants
		}
	}
}
registerCodec(fabricCodec)