import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, Product } from "../../../common";
import { Image } from "../../../common/types";
import _ from "lodash";
import { Dictionary } from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, findInMegaMenu, registerCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import { sleep } from "../../../common/util";
import axios from "axios";
import { config } from "process";
import { ConstructorIOCategory, ConstructorIOProduct } from "./types";
import slugify from "slugify";

type CodecConfig = {
    api_key: StringProperty
    api_token: StringProperty
}

const mapCategory = (category: ConstructorIOCategory): Category => ({
    id: category.id,
    slug: category.id,
    name: category.name,
    children: category.children.map(mapCategory),
    products: []
})

const mapProduct = (product: ConstructorIOProduct, megaMenu: Category[]): Product => {
    return {
        id: product.id,
        name: product.name,
        slug: slugify(product.name, { lower: true }),
        categories: product.group_ids.map(gid => findInMegaMenu(megaMenu, gid)),
        imageSetId: product.variations[0]?.metadata['attribute-articleNumberMax']?.padStart(6, '0'),
        variants: product.variations.map(variation => {
            let attributes: Dictionary<string> = {}
            let images: Image[] = []

            _.each(variation.metadata, (value, key) => {
                if (key.startsWith('attribute-')) {
                    attributes[key.replace('attribute-', '')] = value
                }
                else if (key.startsWith('image-')) {
                    images.push({ url: variation.metadata[key] })
                }
            })

            return {
                sku: variation.id,
                listPrice: variation.metadata.listPrice,
                salePrice: variation.metadata.salePrice,
                images,
                attributes
            }
        })
    }
}

export class ConstructorIOCommerceCodecType extends CommerceCodecType {
    get vendor(): string {
        return 'constructor.io'
    }

    get properties(): CodecConfig {
        return {
            api_key: {
                title: "API Key",
                type: "string"
            },
            api_token: {
                title: "API Token",
                type: "string"
            }
        }
    }

    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new ConstructorIOCommerceCodec(config).init()
    }
}

export class ConstructorIOCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>

    // instance variables
    async init(): Promise<CommerceCodec> {
        return await super.init()
    }

    async fetch(url: string): Promise<any> {
        try {
            return (await axios.get(url, {
                baseURL: `https://ac.cnstrc.com`,
                headers: {
                    Authorization: `Basic ${btoa(`${this.config.api_token}:`)}`
                },
                params: {
                    key: this.config.api_key
                }
            })).data
        } catch (error) {
            if (error.message.indexOf('429') > -1 || error.status === 429) { // rate limited, wait 10 seconds and try again
                await sleep(10000)
                return await fetch(url)
            }
        }
    }

    async cacheMegaMenu(): Promise<void> {
        let categories = await this.fetch(`/v1/item_groups`)
        this.megaMenu = categories.filter(cat => cat.parent === 'master').map(mapCategory(categories))
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        let products: ConstructorIOProduct[] = []
        if (args.productIds) {
            products = await this.fetch(`/v1/item_groups&section=Products&${args.productIds.split(',').map(id => `id=${id}`).join('&')}`)
        }
        else if (args.keyword) {
            products = await this.fetch(`/search/${args.keyword}`)
        }
        else if (args.category) {
            let browseResults = (await this.fetch(`/browse/group_id/${args.category.slug}`)).response.results
            return await this.getProducts({ productIds: _.map(_.take(browseResults, 10), 'data.id').join(',') })
        }
        return products.map(prod => mapProduct(prod, this.megaMenu))
    }
}

export default ConstructorIOCommerceCodecType
registerCodec(new ConstructorIOCommerceCodecType())