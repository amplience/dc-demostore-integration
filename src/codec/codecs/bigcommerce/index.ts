import { APIConfiguration, APIProperties, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from '../../../common'
import _ from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core'
import { StringProperty } from '../../cms-property-types'
import axios from 'axios'
import { BigCommerceProduct } from './types'
import { mapCategory, mapCustomerGroup, mapProduct } from './mappers'
import { catchAxiosErrors } from '../codec-error'
import { getProductsArgError, logResponse, mapIdentifiers } from '../common'

/**
 * BigCommerce Codec config properties
 */
type CodecConfig = APIConfiguration & {
	api_token: StringProperty
	store_hash: StringProperty
}

/**
 * Commerce Codec Type that integrates with BigCommerce.
 */
export class BigCommerceCommerceCodecType extends CommerceCodecType {

	/**
	 * @inheritdoc
	 */
	get vendor(): string {
		return 'bigcommerce'
	}

	/**
	 * @inheritdoc
	 */
	get properties(): CodecConfig {
		return {
			...APIProperties,
			api_token: {
				title: 'API Token',
				type: 'string',
				minLength: 1
			},
			store_hash: {
				title: 'Store hash',
				type: 'string',
				minLength: 1
			}
		}
	}

	/**
	 * @inheritdoc 
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new BigCommerceCommerceCodec(config).init(this)
	}
}

/**
 * ommerce Codec that integrates with BigCommerce.
 */
export class BigCommerceCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	/**
	 * @inheritdoc
	 */
	async cacheMegaMenu(): Promise<void> {
		this.megaMenu = (await this.fetch('/v3/catalog/categories/tree')).map(mapCategory)
	}

	/**
	 * Fetches data using store hash and API token.
	 * @param url URL to fetch data from
	 * @returns Response data
	 */
	async fetch(url: string): Promise<any> {
		const request = {
			method: 'get',
			url,
			baseURL: `${this.config.api_url}/stores/${this.config.store_hash}`,
			headers: {
				'X-Auth-Token': this.config.api_token,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}
		const response = await catchAxiosErrors(async () => await axios.request(request))
		if (url.indexOf('customer_groups') > -1) {
			return logResponse('get', url, response).data
		}
		return logResponse('get', url, response).data.data
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
	async getRawProducts(args: GetProductsArgs, method = 'getRawProducts'): Promise<BigCommerceProduct[]> {
		let products: BigCommerceProduct[] = []
		if (args.productIds && args.productIds === '') {
			products = []
		} else if (args.productIds) {
			const ids = args.productIds.split(',')
			products = mapIdentifiers<BigCommerceProduct>(ids, await this.fetch(`/v3/catalog/products?id:in=${args.productIds}&include=images,variants`))
		} else if (args.keyword) {
			products = await this.fetch(`/v3/catalog/products?keyword=${args.keyword}&include=images,variants`)
		} else if (args.category && args.category.id === '') {
			products = []
		} else if (args.category) {
			products = await this.fetch(`/v3/catalog/products?categories:in=${args.category.id}&include=images,variants`)
		} else {
			throw getProductsArgError(method)
		}
		return products
	}

	/**
	 * @inheritdoc 
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return (await this.fetch('/v2/customer_groups')).map(mapCustomerGroup)
	}
}

export default BigCommerceCommerceCodecType
// registerCodec(new BigCommerceCommerceCodecType())