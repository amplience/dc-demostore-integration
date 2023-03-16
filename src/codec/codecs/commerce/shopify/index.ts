import { 
	CommerceAPI, 
	CommonArgs, 
	CustomerGroup, 
	GetProductsArgs, 
	Product, 
} from '../../../../common'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core'
import { getProductsArgError, logResponse } from '../../common'
import { StringProperty } from '../../../cms-property-types'
import axios, { AxiosInstance } from 'axios'
import { catchAxiosErrors } from '../../codec-error'
import { 
	GqlResponse, 
	ShopifyCollections, 
	ShopifyProduct, 
	ShopifyProductByID, 
	ShopifyProductsByCollection, 
	ShopifyProductsByQuery,
	ShopifySegments,
 } from './types'
import { collections, productById, productsByCategory, productsByQuery, segments } from './queries'
import { mapCategory, mapCustomerGroup, mapProduct } from './mappers'

/**
 * Shopify codec configuration.
 */
type CodecConfig = {
	access_token: StringProperty,
	admin_access_token: StringProperty,
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
			admin_access_token:  {
				title: 'admin access token',
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
	adminApiClient: AxiosInstance

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
		this.adminApiClient = axios.create({
			baseURL: `https://${this.config.site_id}.myshopify.com/admin/api/${this.config.version}`,
			headers: {
				'X-Shopify-Access-Token': this.config.admin_access_token
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
	async gqlRequest<T>(query: string, variables: any, isAdmin: boolean = false): Promise<T> {
		const url = 'graphql.json'
		const result: GqlResponse<T> = await logResponse('post', url, (await catchAxiosErrors(async () =>
			{
				if (isAdmin) {
					return await this.adminApiClient.post(url, {
						query,
						variables
					})
				} else {
					return await this.apiClient.post(url, {
						query,
						variables
					})	
				}
			}
		)).data)

		return result.data
	}

	/**
	 * @inheritdoc
	 */
	async cacheMegaMenu(): Promise<void> {
		// TODO: pagination
		const pageSize = 100
		const result = await this.gqlRequest<ShopifyCollections>(collections, {pageSize})

		this.megaMenu = result.collections.edges.map(edge => mapCategory(edge.node))
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
	 * @param slug 
	 * @returns 
	 */
	async getProductsByCategory(slug: string): Promise<ShopifyProduct[]> {
		// TODO: pagination
		const handle = slug
		const pageSize = 100
		const result = await this.gqlRequest<ShopifyProductsByCollection>(productsByCategory, {handle, pageSize})

		return result.collection.products.edges.map(edge => edge.node)
	}

	/**
	 * @inheritdoc
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		return (await this.getRawProducts(args)).map(mapProduct)
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
	async getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]> {
		const pageSize = 100
		const result = await this.gqlRequest<ShopifySegments>(segments, {pageSize}, true)
		return result.segments.edges.map(edge => mapCustomerGroup(edge.node))
	}
}

export default ShopifyCommerceCodecType
// registerCodec(new ShopifyCommerceCodecType())