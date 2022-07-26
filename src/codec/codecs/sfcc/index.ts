import { Category, ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthRestClient, OAuthRestClientInterface, Product } from "../../../common";
import _ from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import axios from "axios";
import { SFCCCategory, SFCCProduct } from "./types";
import { formatMoneyString } from "../../../common/util";
import slugify from "slugify";

type CodecConfig = ClientCredentialsConfiguration & {
    api_token: StringProperty
    site_id: StringProperty
}

export class SFCCCommerceCodecType extends CommerceCodecType {
    get vendor(): string {
        return 'sfcc'
    }

    get properties(): CodecConfig {
        return {
            ...ClientCredentialProperties,
            api_token: {
                title: "Shopper API Token",
                type: "string",
                maxLength: 100
            },
            site_id: {
                title: "Site ID",
                type: "string"
            }
        }
    }

    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new SFCCCommerceCodec(config).init(this)
    }
}

const mapCategory = (category: SFCCCategory): Category => {
    return {
        id: category.id,
        slug: category.id,
        name: category.name,
        children: category.categories?.map(mapCategory) || [],
        products: []
    }
}

const mapProduct = (product: SFCCProduct): Product => {
    if (!product) { return null }
    const largeImages = product.image_groups.find(group => group.view_type === 'large')
    const images = largeImages.images.map(image => ({ url: image.link }))
    return {
        id: product.id,
        name: product.name,
        slug: slugify(product.name, { lower: true }),
        shortDescription: product.short_description,
        longDescription: product.long_description,
        categories: [],
        variants: product.variants?.map(variant => ({
            sku: variant.product_id,
            listPrice: formatMoneyString(variant.price, { currency: product.currency }),
            salePrice: formatMoneyString(variant.price, { currency: product.currency }),
            images,
            attributes: variant.variation_values
        })) || [{
            sku: product.id,
            listPrice: formatMoneyString(product.price, { currency: product.currency }),
            salePrice: formatMoneyString(product.price, { currency: product.currency }),
            images,
            attributes: {}
        }]
    }
}

export class SFCCCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>

    // instance variables
    rest: OAuthRestClientInterface
    shopApi: string
    sitesApi: string

    async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
        this.shopApi = `/s/${this.config.site_id}/dw/shop/v22_4`
        this.sitesApi = `/s/-/dw/data/v22_4/sites/${this.config.site_id}`
        this.rest = OAuthRestClient({
                ...this.config,
                auth_url: `${this.config.auth_url.replace('oauth/access', 'oauth2/access')}?grant_type=client_credentials`
            }, {}, {
                headers: {
                    Authorization: 'Basic ' + this.config.api_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    client_id: this.config.client_id
                }
            })
        return await super.init(codecType)
    }

    async cacheMegaMenu(): Promise<void> {
        let categories = (await this.fetch(`${this.shopApi}/categories/root?levels=4`)).categories
        this.megaMenu = categories.filter(cat => cat.parent_category_id === 'root').map(mapCategory)
    }

    async fetch(url: string): Promise<any> {
        return (await axios.get(url, {
            baseURL: this.config.api_url,
            params: {
                client_id: this.config.client_id
            }
        })).data
    }

    async authenticatedFetch(url: string): Promise<any> {
        return (await this.rest.get({ url })).data
    }

    async getProductById(productId: string): Promise<SFCCProduct> {
        return await this.fetch(`${this.shopApi}/products/${productId}?expand=prices,options,images,variations`)
    }

    async search(query: string): Promise<SFCCProduct[]> {
        let searchResults = (await this.fetch(`${this.shopApi}/product_search?${query}`)).hits
        if (searchResults) {
            return await Promise.all(searchResults.map(async searchResult => {
                return await this.getProductById.bind(this)(searchResult.product_id)
            }))
        }
        return []
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        let products: SFCCProduct[] = []
        if (args.productIds) {
            products = await Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)))
        }
        else if (args.keyword) {
            products = await this.search(`q=${args.keyword}`)
        }
        else if (args.category) {
            products = await this.search(`refine_1=cgid=${args.category.id}`)
        }
        return products.map(mapProduct)
    }

    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
        return await this.authenticatedFetch(`${this.sitesApi}/customer_groups`)
    }
}

export default SFCCCommerceCodecType
registerCodec(new SFCCCommerceCodecType())