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
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../'
import { StringProperty, StringPatterns } from '../../cms-property-types'

/**
 * TODO
 */
type CodecConfig = {
    productURL:         StringProperty
    categoryURL:        StringProperty
    customerGroupURL:   StringProperty
    translationsURL:    StringProperty
}

/**
 * TODO
 * @param url 
 * @param defaultValue 
 * @returns 
 */
const fetchFromURL = async (url: string, defaultValue: any) => _.isEmpty(url) ? defaultValue : await (await fetch(url)).json()
export class RestCommerceCodecType extends CommerceCodecType {

	/**
	 * TODO
	 */
	get vendor(): string {
		return 'rest'
	}

	/**
	 * TODO
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
	 * TODO
	 * @param config 
	 * @returns 
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new RestCommerceCodec(config).init(this)
	}
}

/**
 * TODO
 */
export class RestCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	categories: Category[]
	products: Product[]
	customerGroups: CustomerGroup[]
	translations: Dictionary<Dictionary<string>>

	/**
	 * TODO
	 */
	async cacheMegaMenu(): Promise<void> {
		this.categories = await fetchFromURL(this.config.categoryURL, [])
		this.products = await fetchFromURL(this.config.productURL, [])
		this.customerGroups = await fetchFromURL(this.config.customerGroupURL, [])
		this.translations = await fetchFromURL(this.config.translationsURL, {})
		this.megaMenu = this.categories.filter(cat => !cat.parent)
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		if (args.productIds) {
			return this.products.filter(prod => args.productIds.split(',').includes(prod.id))
		}
		else if (args.keyword) {
			return this.products.filter(prod => prod.name.toLowerCase().indexOf(args.keyword.toLowerCase()) > -1)
		}
		else if (args.category) {
			return [
				..._.filter(this.products, prod => _.includes(_.map(prod.categories, 'id'), args.category.id))
			]
		}
		throw new Error('getProducts() requires either: productIds, keyword, or category reference')
	}

	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return this.customerGroups
	}
}

export default RestCommerceCodecType
// registerCodec(new RestCommerceCodecType())