import { 
	CommerceAPI, 
	CommonArgs, 
	GetProductsArgs, 
	Identifiable, 
	Product 
} from '../../common'
import _ from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from './core'
import { SFCCProduct } from './sfcc/types'

/**
 * Common codec configuration.
 */
type CodecConfig = {
    // productURL:         StringProperty
}

/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
export class TemplateCommerceCodecType extends CommerceCodecType {

	/**
	 * @inheritdoc
	 */
	get vendor(): string {
		return 'template'
	}

	/**
	 * @inheritdoc
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
	 * @inheritdoc
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new TemplateCommerceCodec(config).init(this)
	}
}

/**
 * A template commerce codec, useful as a starting point for a new integration.
 */
export class TemplateCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	// instance variables
	// products: Product[]
	// categories: Category[]

	/**
	 * @inheritdoc
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		// this.products = await fetchFromURL(this.config.productURL, [])
		// this.megaMenu = this.categories.filter(cat => !cat.parent)
		return await super.init(codecType)
	}

	/**
	 * @inheritdoc
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
	 * @inheritdoc
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
	 * @inheritdoc
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return []
	}
}

export default TemplateCommerceCodecType
// registerCodec(new TemplateCommerceCodecType())