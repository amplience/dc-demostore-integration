import { Category, ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, OAuthRestClient, OAuthRestClientInterface, Product, UsernamePasswordConfiguration, UsernamePasswordProperties } from "../../../common";
import _ from "lodash";
import { Dictionary } from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import { AkeneoCategory, AkeneoProduct } from "./types";
import { mapCategory, mapProduct } from "./mappers";
import { quoteProductIdString } from "../../../common/util";
import btoa from 'btoa'

type CodecConfig = UsernamePasswordConfiguration & ClientCredentialsConfiguration

export class AkeneoCommerceCodecType extends CommerceCodecType {
    get vendor(): string {
        return 'akeneo'
    }

    get properties(): CodecConfig {
        return {
            ...UsernamePasswordProperties,
            ...ClientCredentialProperties
        }
    }

    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new AkeneoCommerceCodec(config).init()
    }
}

export class AkeneoCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>
    rest: OAuthRestClientInterface

    async init(): Promise<CommerceCodec> {
        this.rest = OAuthRestClient({
            api_url: `${this.config.api_url}/api/rest/v1`,
            auth_url: `${this.config.api_url}/api/oauth/v1/token`
        }, {
            username: this.config.username,
            password: this.config.password,
            grant_type: "password"
        }, {
            headers: {
                Authorization: `Basic ${btoa(`${this.config.client_id}:${this.config.client_secret}`)}`
            }
        }, (auth: any) => ({
            Authorization: `Bearer ${auth.access_token}`
        }))
        return await super.init()
    }

    async cacheMegaMenu(): Promise<void> {
        let categories: AkeneoCategory[] = await this.fetch('/categories?limit=100')
        categories = _.concat(categories, await this.fetch('/categories?limit=100&page=2'))
        categories = _.concat(categories, await this.fetch('/categories?limit=100&page=3'))
        this.megaMenu = categories.filter(cat => cat.parent === 'master').map(mapCategory(categories))
    }

    async fetch(url: string): Promise<any> {
        try {
            let result = await this.rest.get({ url })
            return result._embedded ? result._embedded.items : result
        } catch (error) {
            console.log(`error url [ ${url} ]`)                
        }
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        let products: AkeneoProduct[] = []
        if (args.productIds) {
            products = await this.fetch(`/products?search={"identifier":[{"operator":"IN","value":[${quoteProductIdString(args.productIds)}]}]}`)
        }
        else if (args.keyword) {
            products = await this.fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`)
        }
        else if (args.category) {
            products = await this.fetch(`/products?search={"categories":[{"operator":"IN","value":["${args.category.id}"]}]}`)
        }
        return products.map(mapProduct(args))
    }
}

export default AkeneoCommerceCodecType
registerCodec(new AkeneoCommerceCodecType())