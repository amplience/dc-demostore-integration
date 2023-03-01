import { 
	Category, 
	CommerceAPI, 
	CommonArgs, 
	CustomerGroup, 
	GetProductsArgs, 
	Identifiable, 
	Product 
} from '../../../common'
import _ from 'lodash'
import { Dictionary } from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core'
import { StringProperty, StringPatterns } from '../../cms-property-types'
import axios from 'axios'
import { catchAxiosErrors } from '../codec-error'
import { getProductsArgError, mapIdentifiers } from '../common'

/**
 * REST Codec config properties.
 */
type CodecConfig = {
    productURL:         StringProperty
    categoryURL:        StringProperty
    customerGroupURL:   StringProperty
    translationsURL:    StringProperty
}

/**
 * Fetch JSON from a given URL.
 * @param url URL to fetch from
 * @param defaultValue Default value if URL is empty
 * @returns Response data
 */
const fetchFromURL = async (url: string, defaultValue: any) => _.isEmpty(url) ? defaultValue : await catchAxiosErrors(async () => (await axios.get(url)).data)

/**
 * Commerce Codec Type that integrates with REST.
 */
export class RestCommerceCodecType extends CommerceCodecType {

	/**
	 * @inheritdoc
	 */
	get vendor(): string {
		return 'rest'
	}

	/**
	 * @inheritdoc
	 */
	get properties(): CodecConfig {
		return {
			productURL: {
				title: 'Product file URL',
				type: 'string',
				pattern: StringPatterns.anyUrl
			},
			categoryURL: {
				title: 'Category file URL',
				type: 'string',
				pattern: StringPatterns.anyUrl
			},
			customerGroupURL: {
				title: 'Customer group file URL',
				type: 'string',
				pattern: StringPatterns.anyUrl
			},
			translationsURL: {
				title: 'Translations file URL',
				type: 'string',
				pattern: StringPatterns.anyUrl
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new RestCommerceCodec(config).init(this)
	}
}

/**
 * Commerce Codec that integrates with REST.
 */
export class RestCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	categories: Category[]
	products: Product[]
	customerGroups: CustomerGroup[]
	translations: Dictionary<Dictionary<string>>

	/**
	 * @inheritdoc
	 */
	async cacheMegaMenu(): Promise<void> {
		this.categories = await fetchFromURL(this.config.categoryURL, [])
		this.products = await fetchFromURL(this.config.productURL, [])
		this.customerGroups = await fetchFromURL(this.config.customerGroupURL, [])
		this.translations = await fetchFromURL(this.config.translationsURL, {})
		this.megaMenu = this.categories.filter(cat => !cat.parent)
	}

	/**
	 * @inheritdoc
	 */
	async getProducts(args: GetProductsArgs, raw = false): Promise<Product[]> {
		await this.ensureMegaMenu()

		if (args.productIds) {
			const ids = args.productIds.split(',')
			return mapIdentifiers(ids, this.products.filter(prod => ids.includes(prod.id)))
		}
		else if (args.keyword) {
			return this.products.filter(prod => prod.name.toLowerCase().indexOf(args.keyword.toLowerCase()) > -1)
		}
		else if (args.category) {
			return [
				..._.filter(this.products, prod => _.includes(_.map(prod.categories, 'id'), args.category.id))
			]
		}

		throw getProductsArgError(raw ? 'getProductsRaw' : 'getProducts')
	}

	/**
	 * @inheritdoc
	 */
	async getRawProducts(args: GetProductsArgs): Promise<Product[]> {
		return await this.getProducts(args, true)
	}

	/**
	 * @inheritdoc
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		await this.ensureMegaMenu()

		return this.customerGroups
	}
}

export default RestCommerceCodecType
// registerCodec(new RestCommerceCodecType())