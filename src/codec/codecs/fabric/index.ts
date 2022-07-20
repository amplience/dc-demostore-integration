import { CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthCodecConfiguration, OAuthProperties, OAuthRestClient, OAuthRestClientInterface, Product, UsernamePasswordConfiguration, UsernamePasswordProperties } from "../../../common";
import _ from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import { mapCategory, mapProduct } from "./mappers";
import { FabricProduct } from "./types";
import { quote, quoteProductIdString } from "../../../common/util";

type CodecConfig = OAuthCodecConfiguration & UsernamePasswordConfiguration & {
    accountId: StringProperty
    accountKey: StringProperty
    stage: StringProperty
}

export class FabricCommerceCodecType extends CommerceCodecType {
    get vendor(): string {
        return 'fabric'
    }

    get properties(): CodecConfig {
        return {
            ...OAuthProperties,
            ...UsernamePasswordProperties,
            accountId: {
                title: "Account ID",
                type: "string"
            },
            accountKey: {
                title: "Account Key",
                type: "string"
            },
            stage: {
                title: "Stage",
                type: "string"
            }
        }
    }

    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new FabricCommerceCodec(config).init()
    }
}

export class FabricCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>
    rest: OAuthRestClientInterface

    // instance variables
    // products: Product[]
    // categories: Category[]

    async init(): Promise<CommerceCodec> {
        this.rest = OAuthRestClient(this.config, this.config, {
            headers: {
                'content-type': 'application/json'
            }
        }, (auth: any) => {
            return {
                Authorization: auth.accessToken,

                // todo: what comprises site-context?
                // todo: what do we need to remove (abstract) from here?  account?  stage?
                'x-site-context': JSON.stringify({
                    stage: this.config.stage,
                    account: this.config.accountKey,
                    date: new Date().toISOString(),
                    channel: 12
                })
            }
        })
        return await super.init()
    }

    async fetch(url: string): Promise<any> {
        return await this.rest.get({ url })
    }

    async cacheMegaMenu(): Promise<void> {
        // the 'categories[0].children' of the node returned from this URL are the top level categories
        let categories: any[] = _.get(await this.fetch(`/api-category/v1/category?page=1&size=1&type=ALL`), 'categories[0].children')
        if (!categories) {
            throw new Error('megaMenu node not found')
        }
        this.megaMenu = categories.map(mapCategory)
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        let products: FabricProduct[] = []
        if (args.productIds) {
            products = (await this.fetch(`/api-product/v1/product/search?query=[${args.productIds}]`)).products
        }
        else if (args.keyword) {
            products = (await this.fetch(`/api-product/v1/product/search?query=${args.keyword}`)).products
        }
        else if (args.category) {
            let skus = _.take(_.get(await this.fetch(`/api-category/v1/category/sku?id=${args.category.id}`), 'skus'), 20)
            products = (await this.fetch(`/api-product/v1/product/search?query=[${skus.join(',')}]`)).products
        }

        await Promise.all(products.map(async product => {
            product.attributes = (await this.fetch(`/api-product/v1/product/attribute?sku=${product.sku}`)).attributes
        }))

        return products.map(mapProduct)
    }
}

export default FabricCommerceCodecType
registerCodec(new FabricCommerceCodecType())