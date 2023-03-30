import { 
	CommerceAPI, 
	CommonArgs, 
	CustomerGroup, 
	GetProductsArgs, 
	Product, 
} from '../../../../common'
import { 
	CodecPropertyConfig, 
	CommerceCodecType, 
	CommerceCodec 
} from '../../core'
import { getProductsArgError, logResponse } from '../../common'
import { StringProperty } from '../../../cms-property-types'
import axios, { AxiosInstance } from 'axios'
import { CodecError, CodecErrorType, catchAxiosErrors } from '../../codec-error'
import { 
	GqlError,
	GqlResponse, 
	Paginated, 
	ShopifyCollection, 
	ShopifyCollections, 
	ShopifyProduct, 
	ShopifyProductByID, 
	ShopifyProductsByCollection, 
	ShopifyProductsByQuery,
	ShopifySegment,
	ShopifySegments,
} from './types'
import { 
	collections, 
	productById, 
	productsByCategory, 
	productsByQuery, 
	segments 
} from './queries'
import { 
	mapCategory, 
	mapCustomerGroup, 
	mapProduct 
} from './mappers'
import { GetPageResultCursor, paginateCursor } from '../../pagination'

const PAGE_SIZE = 100

/**
 * Shopify codec configuration.
 */
type CodecConfig = {

	/** Storefront access token */
	access_token: StringProperty,

	/** Admin access token */
	admin_access_token: StringProperty,

	/** API version */
	version: StringProperty,

	/** Site identifier */
	site_id: StringProperty
}

/**
 * Commerce Codec Type that integrates with Shopify.
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
 * Commerce Codec that integrates with Shopify.
 */
export class ShopifyCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>
	apiClient: AxiosInstance
	adminApiClient: AxiosInstance

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

		return await super.init(codecType)
	}

	/**
	 * Converts GraphQL errors to CodecError info.
	 * @param errors GraphQL errors
	 * @returns CodecError info
	 */
	fromGqlErrors(errors: GqlError[]) {
		const message = errors.map(error => error.message).join(', ')

		return {
			message,
			errors
		}
	}

	/**
	 * Make a request to the shopify GraphQL API.
	 * @param query The GraphQL query string
	 * @param variables Variables to use with the GraphQL query
	 * @param isAdmin Whether the admin credentials must be used or not
	 * @returns GraphQL response data
	 */
	async gqlRequest<T>(query: string, variables: any, isAdmin = false): Promise<T> {
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

		if (result.data == null && result.errors) {
			throw new CodecError(CodecErrorType.ApiGraphQL, this.fromGqlErrors(result.errors))
		}

		return result.data
	}

	/**
	 * Generate a function that gets a page from the shopify GraphQL API.
	 * @param query The GraphQL query string
	 * @param variables Variables to use with the GraphQL query
	 * @param getPaginated Function that gets the Paginated<T2> type from the request type T
	 * @param isAdmin Whether the admin credentials must be used or not
	 * @returns A function that gets a page from a cursor and pageSize.
	 */
	getPageGql<T, T2>(query: string, variables: any, getPaginated: (response: T) => Paginated<T2>, isAdmin = false) {
		return async (cursor: string | undefined, pageSize: number): Promise<GetPageResultCursor<T2>> => {
			const result = await this.gqlRequest<T>(query, {...variables, pageSize, after: cursor}, isAdmin)
			const paginated = getPaginated(result)

			if (paginated.edges.length > pageSize) {
				paginated.edges = paginated.edges.slice(0, pageSize)
				
				return {
					data: paginated.edges.map(edge => edge.node),
					nextCursor: paginated.edges[paginated.edges.length - 1].cursor,
					hasNext: true
				}
			}

			return {
				data: paginated.edges.map(edge => edge.node),
				nextCursor: paginated.pageInfo.endCursor,
				hasNext: paginated.pageInfo.hasNextPage
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	async cacheCategoryTree(): Promise<void> {
		const shopifyCollections = await paginateCursor(
			this.getPageGql<ShopifyCollections, ShopifyCollection>(collections, {}, response => response.collections),
			PAGE_SIZE)

		this.categoryTree = shopifyCollections.data.map(collection => mapCategory(collection))
	}

	/**
	 * Get a shopify product by ID.
	 * @param id The ID of the product to fetch
	 * @returns The shopify product
	 */
	async getProductById(id: string): Promise<ShopifyProduct> {
		return (await this.gqlRequest<ShopifyProductByID>(productById, { id: 'gid://shopify/Product/' + id }))?.product ?? null
	}

	/**
	 * Get a list of all shopify products that match the given keyword.
	 * @param keyword Keyword used to search products
	 * @returns A list of all matching products
	 */
	async getProductsByKeyword(keyword: string): Promise<ShopifyProduct[]> {
		const query = keyword
		const shopifyProducts = await paginateCursor(
			this.getPageGql<ShopifyProductsByQuery, ShopifyProduct>(productsByQuery, {query}, response => response.products),
			PAGE_SIZE)

		return shopifyProducts.data
	}

	/**
	 * Get a list of all shopify products in the category with the given slug.
	 * @param slug The category slug
	 * @returns A list of all products in the category
	 */
	async getProductsByCategory(slug: string): Promise<ShopifyProduct[]> {
		const handle = slug
		const shopifyProducts = await paginateCursor(
			this.getPageGql<ShopifyProductsByCollection, ShopifyProduct>(productsByCategory, {handle}, response => response.collection.products),
			PAGE_SIZE)

		return shopifyProducts.data
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
		const shopifySegments = await paginateCursor(
			this.getPageGql<ShopifySegments, ShopifySegment>(segments, {}, response => response.segments, true),
			PAGE_SIZE)

		return shopifySegments.data.map(segment => mapCustomerGroup(segment))
	}
}

export default ShopifyCommerceCodecType
// registerCodec(new ShopifyCommerceCodecType())