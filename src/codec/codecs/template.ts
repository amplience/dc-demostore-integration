import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, Product } from '../../common'
import _ from 'lodash'
import { Dictionary } from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from '../..'
import { StringProperty } from '../cms-property-types'
import { SFCCProduct } from './sfcc/types'

type CodecConfig = {
    // productURL:         StringProperty
}

export class TemplateCommerceCodecType extends CommerceCodecType {
	get vendor(): string {
		return 'template'
	}

	get properties(): CodecConfig {
		return {
			// productURL: {
			//     title: "Product file URL",
			//     type: "string"
			// }
		}
	}

	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new TemplateCommerceCodec(config).init(this)
	}
}

export class TemplateCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>

	// instance variables
	// products: Product[]
	// categories: Category[]

	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		// this.products = await fetchFromURL(this.config.productURL, [])
		// this.megaMenu = this.categories.filter(cat => !cat.parent)
		return await super.init(codecType)
	}

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

	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return []
	}
}

export default TemplateCommerceCodecType
// registerCodec(new TemplateCommerceCodecType())