import { 
	APIProperties,
	ClientCredentialProperties,
	ClientCredentialsConfiguration,
	CommerceAPI, 
	CommonArgs, 
	GetProductsArgs, 
	Identifiable, 
	Product 
} from '../../../../common'
import _ from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core'
import { getProductsArgError, logResponse } from '../../common'
import { StringProperty } from '@/codec/cms-property-types'
import axios, { AxiosInstance } from 'axios'
import { catchAxiosErrors } from '../../codec-error'

/**
 * Common codec configuration.
 */
type CodecConfig = ClientCredentialsConfiguration & {
	accessToken: StringProperty,
	version: StringProperty,
	site_id: StringProperty
}

interface GqlResponse<T> {
	data: T
}

const productQuery = `
query getProductById($id: ID!) {
	product(id: $id) {
		title
	}
}`

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
			...ClientCredentialProperties,
			accessToken:  {
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
		axios.create({
			baseURL: `https://${this.config.site_id}.myshopify.com/api/${this.config.version}`,
			headers: {
				'X-Shopify-Storefront-Access-Token': this.config.accessToken
			}
		})

		// this.products = await fetchFromURL(this.config.productURL, [])
		// this.megaMenu = this.categories.filter(cat => !cat.parent)
		return await super.init(codecType)
	}

	async gqlRequest<T>(query: string, variables: any): Promise<T> {
		const url = 'graphql.json'
		const result: GqlResponse<T> = await logResponse('get', url, (await catchAxiosErrors(
			await this.apiClient.post(url, {
				query,
				variables
			})
		)))

		return result.data
	}

	async getProductById(id: string) {
		return await this.gqlRequest<any>(productQuery, { id })
	}

	/**
	 * @inheritdoc
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		// eslint-disable-next-line no-empty
		if (args.productIds) {
			const products = await Promise.all(
				args.productIds.split(',').map(this.getProductById.bind(this))
			)
		}
		// eslint-disable-next-line no-empty
		else if (args.keyword) {

		}
		// eslint-disable-next-line no-empty
		else if (args.category) {

		}
		else {
			throw getProductsArgError('getProducts')
		}

		return []
	}

	/**
	 * @inheritdoc
	 */
	async getRawProducts(args: GetProductsArgs): Promise<any[]> {
		// eslint-disable-next-line no-empty
		if (args.productIds) {

		}
		// eslint-disable-next-line no-empty
		else if (args.keyword) {

		}
		// eslint-disable-next-line no-empty
		else if (args.category) {
			
		}
		else {
			throw getProductsArgError('getRawProducts')
		}

		return []
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