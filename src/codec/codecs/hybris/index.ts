import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, CommonArgs } from '../../../common/types'
import { CodecPropertyConfig, CodecType, CommerceCodec, registerCodec, StringProperty } from '../..'
import { CommerceAPI } from '../../..'
import { findInMegaMenu } from '../common'
import axios from 'axios'
import { HybrisCategory, HybrisProduct } from './types'
import slugify from 'slugify'
import { APIConfiguration, APIProperties } from '../../../common/rest-client'
import { SFCCProduct } from '../sfcc/types'

type CodecConfig = APIConfiguration & {
    catalog_id: StringProperty
}

const properties: CodecConfig = {
	...APIProperties,
	catalog_id: {
		title: 'Catalog ID',
		type: 'string'
	}
}

const mapCategory = (category: HybrisCategory): Category => ({
	...category,
	slug: slugify(category.name, { lower: true }),
	children: category.subcategories.map(mapCategory),
	products: []
})

const mapProduct = (product: HybrisProduct): Product => ({
	...product,
	id: product.code,
	slug: slugify(product.name, { lower: true }),
	longDescription: product.description,
	categories: [],
	variants: [{
		sku: product.code,
		listPrice: product.price.formattedValue,
		salePrice: '',
		images: [],
		attributes: _.zipObject(Object.keys(product), Object.values(product))
	}]
})

const hybrisCodec: CommerceCodec = {
	metadata: {
		type:   CodecType.commerce,
		vendor: 'hybris',
		properties
	},
	getAPI: async (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> => {
		const rest = axios.create({ baseURL: `${config.api_url}/occ/v2/${config.catalog_id}` })
		const fetch = async (url: string) => await (await rest.get(url)).data

		const populate = async function (category: Category): Promise<Category> {
			return {
				...category,
				products: (await fetch(`/categories/${category.id}/products?fields=FULL`)).products.map(mapProduct)
			}
		}

		const megaMenu: Category[] = mapCategory((await rest.get(`/catalogs/${config.catalog_id}ProductCatalog/Online/categories/1`)).data).children

		// CommerceAPI implementation
		const getProduct = async function (args: GetCommerceObjectArgs): Promise<Product> {
			return mapProduct(await fetch(`/products/${args.id}?fields=FULL`))
		}

		const getProducts = async function (args: GetProductsArgs): Promise<Product[]> {
			if (args.productIds) {
				return await Promise.all(args.productIds.split(',').map(async id => await getProduct({ id })))
			}
			else if (args.keyword) {
				return (await fetch(`/products/search?query=${args.keyword}&fields=FULL`)).map(mapProduct)
			}
		}

		const getCategory = async function (args: GetCommerceObjectArgs): Promise<Category> {
			return await populate(findInMegaMenu(await getMegaMenu(args), args.slug))
		}

		const getMegaMenu = async function (args: CommonArgs): Promise<Category[]> {
			return megaMenu
		}

		const getCustomerGroups = async function (args: CommonArgs): Promise<CustomerGroup[]> {
			// don't know where these will come from
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
registerCodec(hybrisCodec)