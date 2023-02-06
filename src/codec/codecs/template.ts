import { 
	CommerceAPI, 
	CommonArgs, 
	GetProductsArgs, 
	Identifiable, 
	Product 
} from '../../common'
import _ from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..'
import { SFCCProduct } from './sfcc/types'

/**
 * TODO
 */
type CodecConfig = {
    // productURL:         StringProperty
}

/**
 * TODO
 */
export class TemplateCommerceCodecType extends CommerceCodecType {

	/**
	 * TODO
	 */
	get vendor(): string {
		return 'template'
	}

	/**
	 * TODO
	 */
	get properties(): CodecConfig {
		return {
			// productURL: {
			//     title: "Product file URL",
			//     type: "string"
			// }
		}
	}

	/**
	 * TODO
	 * @param config 
	 * @returns 
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new TemplateCommerceCodec(config).init(this)
	}
}

/**
 * TODO
 */
export class TemplateCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	// instance variables
	// products: Product[]
	// categories: Category[]

	/**
	 * TODO
	 * @param codecType 
	 * @returns 
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		// this.products = await fetchFromURL(this.config.productURL, [])
		// this.megaMenu = this.categories.filter(cat => !cat.parent)
		return await super.init(codecType)
	}

	/**
	 * TODO
	 * @param args 
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		// eslint-disable-next-line no-empty
		if (args.productIds) {
		}
		// eslint-disable-next-line no-empty
		else if (args.keyword) {
		}
		// eslint-disable-next-line no-empty
		else if (args.category) {
		}
		throw new Error('getProducts() requires either: productIds, keyword, or category reference')
	}

	/**
	 * TODO
	 * @param args 
	 */
	async getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]> {
		// eslint-disable-next-line no-empty
		if (args.productIds) {
		}
		// eslint-disable-next-line no-empty
		else if (args.keyword) {
		}
		// eslint-disable-next-line no-empty
		else if (args.category) {
		}
		throw new Error('getProducts() requires either: productIds, keyword, or category reference')
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return []
	}
}

export default TemplateCommerceCodecType
// registerCodec(new TemplateCommerceCodecType())