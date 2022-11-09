import { APIConfiguration, APIProperties, Category, CommerceAPI, CommonArgs, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Identifiable, Product } from '../../../common'
import _ from 'lodash'
import { Dictionary } from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from '../..'
import { StringProperty } from '../../cms-property-types'
import slugify from 'slugify'
import { HybrisCategory, HybrisProduct } from './types'
import axios, { AxiosInstance } from 'axios'

type CodecConfig = APIConfiguration & {
    catalog_id: StringProperty
}

export class HybrisCommerceCodecType extends CommerceCodecType {
	get vendor(): string {
		return 'hybris'
	}

	get properties(): CodecConfig {
		return {
			...APIProperties,
			catalog_id: {
				title: 'Catalog ID',
				type: 'string',
				minLength: 1
			}
		}
	}

	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new HybrisCommerceCodec(config).init(this)
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

export class HybrisCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	// instance variables
	rest: AxiosInstance

	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		this.rest = axios.create({ baseURL: `${this.config.api_url}/occ/v2/${this.config.catalog_id}` })
		return await super.init(codecType)
	}

	async fetch(url: string): Promise<any> {
		return await (await this.rest.get(url)).data
	}

	async cacheMegaMenu(): Promise<void> {
		this.megaMenu = mapCategory((await this.rest.get(`/catalogs/${this.config.catalog_id}ProductCatalog/Online/categories/1`)).data).children
		return null
	}

	async getProductById(id: string): Promise<HybrisProduct> {
		return await this.fetch(`/products/${id}?fields=FULL`)
	}

	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		let products: HybrisProduct[] = []
		if (args.productIds) {
			products = await Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)))
		}
		else if (args.keyword) {
			products = (await this.fetch(`/products/search?query=${args.keyword}&fields=FULL`)).products
		}
		else if (args.category) {
			products = (await this.fetch(`/categories/${args.category.id}/products?fields=FULL`)).products
		}
		return products.map(mapProduct)
	}

	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return []
	}
}

export default HybrisCommerceCodecType
// registerCodec(new HybrisCommerceCodecType())