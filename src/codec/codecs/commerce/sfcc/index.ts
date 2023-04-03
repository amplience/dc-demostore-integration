import {
	Category,
	ClientCredentialProperties,
	ClientCredentialsConfiguration,
	CommerceAPI,
	CommonArgs,
	GetProductsArgs,
	OAuthRestClient,
	OAuthRestClientInterface,
	Product,
	CustomerGroup
} from '../../../../common'
import _ from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core'
import { StringProperty } from '../../../cms-property-types'
import axios, { AxiosRequestConfig } from 'axios'
import { SFCCCategory, SFCCCustomerGroup, SFCCProduct } from './types'
import { formatMoneyString } from '../../../../common/util'
import slugify from 'slugify'
import btoa from 'btoa'
import { getPageByQuery, getPageByQueryAxios, paginate } from '../../pagination'
import { getProductsArgError, logResponse } from '../../common'
import { CodecErrorType, catchAxiosErrors } from '../../codec-error'

/**
 * SFCC Codec config properties.
 */
type CodecConfig = ClientCredentialsConfiguration & {
	api_token: StringProperty
	site_id: StringProperty
	version?: StringProperty
}

/**
 * Commerce Codec Type that integrates with SFCC.
 */
export class SFCCCommerceCodecType extends CommerceCodecType {
	/**
	 * @inheritdoc
	 */
	get vendor(): string {
		return 'sfcc'
	}

	/**
	 * @inheritdoc
	 */
	get properties(): CodecConfig {
		return {
			...ClientCredentialProperties,
			api_token: {
				title: 'Shopper API Token',
				type: 'string',
				maxLength: 100
			},
			site_id: {
				title: 'Site ID',
				type: 'string'
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new SFCCCommerceCodec(config).init(this)
	}

	/**
	 * @inheritdoc
	 */
	async postProcess(config: CodecConfig): Promise<CodecConfig> {
		// apply any postprocessing required
		return {
			api_token: btoa(`${config.client_id}:${config.client_secret}`),
			...config
		}
	}
}

/**
 * Map an SFCC category to the common category type.
 * @param category SFCC category
 * @returns Category
 */
const mapCategory = (category: SFCCCategory): Category => {
	return {
		id: category.id,
		slug: category.id,
		name: category.name,
		children: category.categories?.map(mapCategory) || [],
		products: []
	}
}

/**
 * Map an SFCC customer group to the common customer group type.
 * @param group SFCC customer group
 * @returns Customer group
 */
const mapCustomerGroup = (group: SFCCCustomerGroup): CustomerGroup =>
	group && {
		...group,
		name: group.id
	}

/**
 * Map an SFCC product to the common product type.
 * @param product SFCC product
 * @returns Product
 */
const mapProduct = (product: SFCCProduct | null): Product => {
	if (!product) {
		return null
	}
	const largeImages = product.image_groups.find((group) => group.view_type === 'large')
	const images = largeImages.images.map((image) => ({ url: image.dis_base_link }))
	return {
		id: product.id,
		name: product.name,
		slug: slugify(product.name, { lower: true }),
		shortDescription: product.short_description,
		longDescription: product.long_description,
		categories: [],
		variants: product.variants?.map((variant) => ({
			id: variant.product_id,
			sku: variant.product_id,
			listPrice: formatMoneyString(variant.price, {
				currency: product.currency
			}),
			salePrice: formatMoneyString(variant.price, {
				currency: product.currency
			}),
			images,
			attributes: variant.variation_values
		})) || [
			{
				id: product.id,
				sku: product.id,
				listPrice: formatMoneyString(product.price, {
					currency: product.currency
				}),
				salePrice: formatMoneyString(product.price, {
					currency: product.currency
				}),
				images,
				attributes: {}
			}
		]
	}
}

/**
 * Commerce Codec that integrates with SFCC.
 */
export class SFCCCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	// instance variables
	rest: OAuthRestClientInterface
	shopApi: string
	sitesApi: string

	getPage = getPageByQuery('start', 'count', 'total', 'data')
	getPageAxios = getPageByQueryAxios('start', 'count', 'total', 'hits')

	/**
	 * @inheritdoc
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		const version = this.config.version ?? 'v22_4'
		this.shopApi = `/s/${this.config.site_id}/dw/shop/${version}`
		this.sitesApi = `/s/-/dw/data/${version}/sites/${this.config.site_id}`
		this.rest = OAuthRestClient(
			{
				...this.config,
				auth_url: `${this.config.auth_url.replace(
					'oauth/access',
					'oauth2/access'
				)}?grant_type=client_credentials`
			},
			{},
			{
				headers: {
					Authorization: 'Basic ' + this.config.api_token,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				params: {
					client_id: this.config.client_id
				}
			}
		)
		return await super.init(codecType)
	}

	/**
	 * @inheritdoc
	 */
	async cacheCategoryTree(): Promise<void> {
		const categories = (await this.fetch(`${this.shopApi}/categories/root?levels=4`)).categories
		this.categoryTree = categories
			.filter((cat) => cat.parent_category_id === 'root')
			.map(mapCategory)
	}

	/**
	 * Gets the request config based off of the configuration parameters
	 * @returns Axios request config
	 */
	axiosConfig(): AxiosRequestConfig {
		return {
			baseURL: this.config.api_url,
			params: {
				client_id: this.config.client_id,
			},
		}
	}

	/**
	 * Fetches data from the unauthenticated axios client.
	 * @param url URL to fetch data from
	 * @returns Response data
	 */
	async fetch(url: string): Promise<any> {
		return logResponse('get', url, (await catchAxiosErrors(async () =>
			await axios.get(url, this.axiosConfig())
		)).data)
	}

	/**
	 * Fetches data from the OAuth authenticated client.
	 * @param url URL to fetch data from
	 * @returns Response data
	 */
	async authenticatedFetch(url: string): Promise<any> {
		return (await this.rest.get({ url })).data
	}

	/**
	 * Gets an SFCC product by ID.
	 * @param productId Product ID to fetch
	 * @returns SFCC product
	 */
	async getProductById(productId: string): Promise<SFCCProduct | null> {
		try {
			return await this.fetch(
				`${this.shopApi}/products/${productId}?expand=prices,options,images,variations&all_images=true`
			)
		} catch (e) {
			if (e.type === CodecErrorType.NotFound) {
				return null
			}
			
			throw e
		}
	}

	/**
	 * Lists SFCC products for a given search query.
	 * @param query Search query
	 * @returns List of SFCC products
	 */
	async search(query: string): Promise<SFCCProduct[]> {
		const searchResults = await paginate<any>(this.getPageAxios(axios, `${this.shopApi}/product_search?${query}`, this.axiosConfig(), {}), 200)

		if (searchResults) {
			return await Promise.all(
				searchResults.map(async (searchResult) => {
					return await this.getProductById.bind(this)(searchResult.product_id)
				})
			)
		}
		return []
	}

	/**
	 * @inheritdoc
	 */
	async getRawProducts(args: GetProductsArgs, method = 'getRawProducts'): Promise<SFCCProduct[]> {
		let products: SFCCProduct[] = []

		if (args.productIds && args.productIds === '') {
			products = []
		} else if (args.productIds) {
			products = await Promise.all(
				args.productIds.split(',').map(this.getProductById.bind(this))
			)
		} else if (args.keyword) {
			products = await this.search(`q=${args.keyword}`)
		} else if (args.category) {
			products = await this.search(`refine_1=cgid=${args.category.id}`)
		} else {
			throw getProductsArgError(method)
		}

		return products
	}

	/**
	 * @inheritdoc
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		return (await this.getRawProducts(args, 'getProducts')).map(mapProduct)
	}

	/**
	 * @inheritdoc
	 */
	async getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]> {
		return (
			await paginate<SFCCCustomerGroup>(this.getPage(this.rest, `${this.sitesApi}/customer_groups`), 1000)
		).map(mapCustomerGroup)
	}
}

export default SFCCCommerceCodecType
// registerCodec(new SFCCCommerceCodecType())
