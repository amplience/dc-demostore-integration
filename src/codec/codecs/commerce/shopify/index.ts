import { 
	CommerceAPI, 
	CommonArgs, 
	GetProductsArgs, 
	Identifiable, 
	Product, 
} from '../../../../common'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core'
import { getProductsArgError, logResponse } from '../../common'
import { StringProperty } from '../../../cms-property-types'
import axios, { AxiosInstance } from 'axios'
import { catchAxiosErrors } from '../../codec-error'
import { 
	GqlResponse, 
	ShopifyProduct, 
	ShopifyProductByID, 
	ShopifyProductsByCategory, 
	ShopifyProductsByQuery,
 } from './types'
import { productById, productsByCategory, productsByQuery } from './queries'
import { mapProduct } from './mappers'

/**
 * Shopify codec configuration.
 */
type CodecConfig = {
	access_token: StringProperty,
	version: StringProperty,
	site_id: StringProperty
}

/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
export class ShopifyCommerceCodecType extends CommerceCodecType {

	/**
	 * @inheritdoc
	 */
	get vendor(): string {
		return 'shopify'
	}

	/**
	 * @inheritdoc
	 */
	get properties(): CodecConfig {
		return {
			access_token:  {
				title: 'access token',
				type: 'string',
				minLength: 1
			},
			version:  {
				title: 'version',
				type: 'string',
				minLength: 1
			},
			site_id:  {
				title: 'site id',
				type: 'string',
				minLength: 1
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new ShopifyCommerceCodec(config).init(this)
	}
}

/**
 * A template commerce codec, useful as a starting point for a new integration.
 */
export class ShopifyCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>
	apiClient: AxiosInstance

	// instance variables
	// products: Product[]
	// categories: Category[]

	/**
	 * @inheritdoc
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		this.apiClient = axios.create({
			baseURL: `https://${this.config.site_id}.myshopify.com/api/${this.config.version}`,
			headers: {
				'X-Shopify-Storefront-Access-Token': this.config.access_token
			}
		})

		// this.products = await fetchFromURL(this.config.productURL, [])
		// this.megaMenu = this.categories.filter(cat => !cat.parent)
		return await super.init(codecType)
	}

	/**
	 * TODO
	 * @param query 
	 * @param variables 
	 * @returns 
	 */
	async gqlRequest<T>(query: string, variables: any): Promise<T> {
		const url = 'graphql.json'
		const result: GqlResponse<T> = await logResponse('get', url, (await catchAxiosErrors(async () =>
			await this.apiClient.post(url, {
				query,
				variables
			})
		)).data)

		return result.data
	}

	/**
	 * TODO
	 * @param id 
	 * @returns 
	 */
	async getProductById(id: string): Promise<ShopifyProduct> {
		return (await this.gqlRequest<ShopifyProductByID>(productById, { id })).product
	}

	/**
	 * TODO
	 * @param keyword 
	 * @returns 
	 */
	async getProductsByKeyword(keyword: string): Promise<ShopifyProduct[]> {
		// TODO: pagination
		const query = keyword
		const pageSize = 100
		const result = await this.gqlRequest<ShopifyProductsByQuery>(productsByQuery, {query, pageSize})

		return result.products.edges.map(edge => edge.node)
	}

	/**
	 * TODO
	 * @param keyword 
	 * @returns 
	 */
	async getProductsByCategory(keyword: string): Promise<ShopifyProduct[]> {
		// TODO: pagination
		const query = keyword
		const pageSize = 100
		const result = await this.gqlRequest<ShopifyProductsByCategory>(productsByCategory, {query, pageSize})

		return result.category.products.edges.map(edge => edge.node)
	}

	/**
	 * @inheritdoc
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		return (await this.getRawProducts(args)).map(product => mapProduct(product))
	}

	/**
	 * @inheritdoc
	 */
	async getRawProducts(args: GetProductsArgs): Promise<ShopifyProduct[]> {
		let products: ShopifyProduct[] = []

		// eslint-disable-next-line no-empty
		if (args.productIds) {
			products = await Promise.all(
				args.productIds.split(',').map(this.getProductById.bind(this))
			)
		}
		// eslint-disable-next-line no-empty
		else if (args.keyword) {
			products = await this.getProductsByKeyword(args.keyword)
		}
		// eslint-disable-next-line no-empty
		else if (args.category) {
			products = await this.getProductsByCategory(args.category.slug)
		}
		else {
			throw getProductsArgError('getRawProducts')
		}

		return products
	}

	/**
	 * @inheritdoc
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return []
	}
}

export default ShopifyCommerceCodecType
// registerCodec(new ShopifyCommerceCodecType())