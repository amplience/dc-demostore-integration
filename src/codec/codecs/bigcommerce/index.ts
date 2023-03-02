import { APIConfiguration, APIProperties, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from "../../../common";
import _ from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core'
import { StringProperty } from "../../cms-property-types";
import axios from "axios";
import { BigCommerceProduct } from "./types";
import { mapCategory, mapCustomerGroup, mapProduct } from "./mappers";
import { catchAxiosErrors } from "../codec-error";
import { getProductsArgError, mapIdentifiersNumber } from "../common";

/**
 * TODO
 */
type CodecConfig = APIConfiguration & {
    api_token:  StringProperty
    store_hash: StringProperty
}

/**
 * TODO
 */
export class BigCommerceCommerceCodecType extends CommerceCodecType {

    /**
     * TODO
     */
    get vendor(): string {
        return 'bigcommerce'
    }

    /**
     * TODO
     */
    get properties(): CodecConfig {
        return {
            ...APIProperties,
            api_token: {
                title: "API Token",
                type: "string",
                minLength: 1
            },
            store_hash: {
                title: "Store hash",
                type: "string",
                minLength: 1
            }
        }
    }

    /**
     * TODO
     * @param config 
     * @returns 
     */
    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new BigCommerceCommerceCodec(config).init(this)
    }
}

/**
 * TODO
 */
export class BigCommerceCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>

    /**
     * TODO
     */
    async cacheMegaMenu(): Promise<void> {
        this.megaMenu = (await this.fetch(`/v3/catalog/categories/tree`)).map(mapCategory)
    }

    /**
     * TODO
     * @param url 
     * @returns 
     */
    async fetch(url: string): Promise<any> {
        const request = {
            method: 'get',
            url,
            baseURL: `${this.config.api_url}/stores/${this.config.store_hash}`,
            headers: {
                'X-Auth-Token': this.config.api_token,
                'Accept': `application/json`,
                'Content-Type': `application/json`
            }
        }
        const response = await catchAxiosErrors(async () => await axios.request(request))
        // console.log('========= REQUEST ==========', JSON.stringify(request, null, 4))
        if (url.indexOf('customer_groups') > -1) {
            // console.log('========= RESPONSE ==========', JSON.stringify(response.data, null, 4))
            return response.data
        }
        // console.log('========= RESPONSE ==========', JSON.stringify(response.data.data, null, 4))
        return response.data.data
    }

    /**
     * TODO
     * @param args 
     * @returns 
     */
    async getProducts(args: GetProductsArgs): Promise<Product[]> {
		return (await this.getRawProducts(args, 'getProducts')).map(mapProduct)
	}

    /**
     * TODO
     * @param args 
     * @returns 
     */
    async getRawProducts(args: GetProductsArgs, method = 'getRawProducts'): Promise<BigCommerceProduct[]> {
        let products: BigCommerceProduct[] = []
        if (args.productIds) {
            const ids = args.productIds.split(',')
            products = mapIdentifiersNumber<BigCommerceProduct>(ids, await this.fetch(`/v3/catalog/products?id:in=${args.productIds}&include=images,variants`))
        } else if (args.keyword) {
            products = await this.fetch(`/v3/catalog/products?keyword=${args.keyword}`)
        } else if (args.category) {
            products = await this.fetch(`/v3/catalog/products?categories:in=${args.category.id}`)
        } else {
			throw getProductsArgError(method)
		}
        return products
    }

    /**
     * TODO
     * @param args 
     * @returns 
     */
    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
        return (await this.fetch(`/v2/customer_groups`)).map(mapCustomerGroup)
    }
}

export default BigCommerceCommerceCodecType
// registerCodec(new BigCommerceCommerceCodecType())