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
	CustomerGroup,
	GetVariantsArgs
} from '../../../common'
import _ from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..'
import { StringProperty } from '../../cms-property-types'
import axios from 'axios'
import { SFCCCategory, SFCCCustomerGroup, SFCCProduct } from './types'
import { formatMoneyString } from '../../../common/util'
import slugify from 'slugify'
import btoa from 'btoa'

/**
 * TODO
 */
type CodecConfig = ClientCredentialsConfiguration & {
	api_token: StringProperty
	site_id: StringProperty
	version?: StringProperty
}

/**
 * TODO
 */
export class SFCCCommerceCodecType extends CommerceCodecType {
	/**
	 * TODO
	 */
	get vendor(): string {
		return 'sfcc'
	}

	/**
	 * TODO
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
	 * TODO
	 * @param config
	 * @returns
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new SFCCCommerceCodec(config).init(this)
	}

	/**
	 * TODO
	 * @param config
	 * @returns
	 */
	// novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
	async postProcess(config: CodecConfig): Promise<CodecConfig> {
		// apply any postprocessing required
		return {
			api_token: btoa(`${config.client_id}:${config.client_secret}`),
			...config
		}
	}
}

/**
 * TODO
 * @param category
 * @returns
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
 * TODO
 * @param group
 * @returns
 */
const mapCustomerGroup = (group: SFCCCustomerGroup): CustomerGroup =>
	group && {
		...group,
		name: group.id
	}

/**
 * TODO
 * @param product
 * @returns
 */
// TODO: [NOVADEV-968] able to choose image size?
const mapProduct = (product: SFCCProduct): Product => {
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
 * TODO
 */
export class SFCCCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	// instance variables
	rest: OAuthRestClientInterface
	shopApi: string
	sitesApi: string

	/**
	 * TODO
	 * @param codecType
	 * @returns
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
	 * TODO
	 */
	async cacheMegaMenu(): Promise<void> {
		const categories = (await this.fetch(`${this.shopApi}/categories/root?levels=4`)).categories
		this.megaMenu = categories
			.filter((cat) => cat.parent_category_id === 'root')
			.map(mapCategory)
	}

	/**
	 * TODO
	 * @param url
	 * @returns
	 */
	async fetch(url: string): Promise<any> {
		return (
			await axios.get(url, {
				baseURL: this.config.api_url,
				params: {
					client_id: this.config.client_id
				}
			})
		).data
	}

	/**
	 * TODO
	 * @param url
	 * @returns
	 */
	async authenticatedFetch(url: string): Promise<any> {
		return (await this.rest.get({ url })).data
	}

	/**
	 * TODO
	 * @param productId
	 * @returns
	 */
	async getProductById(productId: string): Promise<SFCCProduct> {
		return await this.fetch(
			`${this.shopApi}/products/${productId}?expand=prices,options,images,variations&all_images=true`
		)
	}

	/**
	 * TODO
	 * @param query
	 * @returns
	 */
	async search(query: string): Promise<SFCCProduct[]> {
		const searchResults = (
			await this.fetch(`${this.shopApi}/product_search?${query}&count=200`)
		).hits
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
	 * TODO
	 * @param args
	 * @returns
	 */
	async getVariants(args: GetVariantsArgs): Promise<SFCCProduct> {
		return await this.fetch(`${this.shopApi}/products/${args.productId}/variants`)
	}

	/**
	 * TODO
	 * @param args
	 * @returns
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		let products: SFCCProduct[] = []
		if (args.productIds) {
			products = await Promise.all(
				args.productIds.split(',').map(this.getProductById.bind(this))
			)
		} else if (args.keyword) {
			products = await this.search(`q=${args.keyword}`)
		} else if (args.category) {
			products = await this.search(`refine_1=cgid=${args.category.id}`)
		}
		return products.map(mapProduct)
	}

	/**
	 * TODO
	 * @param args
	 * @returns
	 */
	async getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]> {
		let products: SFCCProduct[] = []
		if (args.productIds) {
			products = await Promise.all(
				args.productIds.split(',').map(this.getProductById.bind(this))
			)
		} else if (args.keyword) {
			products = await this.search(`q=${args.keyword}`)
		} else if (args.category) {
			products = await this.search(`refine_1=cgid=${args.category.id}`)
		}
		return products
	}

	/**
	 * TODO
	 * @param args
	 * @returns
	 */
	async getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]> {
		return (await this.authenticatedFetch(`${this.sitesApi}/customer_groups?count=1000`)).map(
			mapCustomerGroup
		)
		//return await this.authenticatedFetch(`${this.sitesApi}/customer_groups`)
	}
}

export default SFCCCommerceCodecType
// registerCodec(new SFCCCommerceCodecType())
