import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, Product } from "../../common";
import _ from "lodash";
import { Dictionary } from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from "../..";
import { StringProperty } from "../cms-property-types";

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
        return await new TemplateCommerceCodec(config).init()
    }
}

export class TemplateCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>

    // instance variables
    // products: Product[]
    // categories: Category[]

    async init(): Promise<CommerceCodec> {
        // this.products = await fetchFromURL(this.config.productURL, [])
        // this.megaMenu = this.categories.filter(cat => !cat.parent)
        return await super.init()
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        if (args.productIds) {
        }
        else if (args.keyword) {
        }
        else if (args.category) {
        }
        throw new Error(`getProducts() requires either: productIds, keyword, or category reference`)
    }

    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
        return []
    }
}

export default TemplateCommerceCodecType
registerCodec(new TemplateCommerceCodecType())