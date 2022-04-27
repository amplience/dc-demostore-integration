// 3rd party libs
import _ from 'lodash'
import axios from 'axios'
import { Codec, CommerceCodec, registerCodec, CodecConfiguration } from '../../../codec'
import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Product } from '../../../index'
import { mapProduct, mapCategory, mapCustomerGroup } from './mappers'
import { findInMegaMenu } from '../common'

export interface BigCommerceCodecConfiguration extends CodecConfiguration {
    api_url: string
    api_token: string
    store_hash: string
}

const bigCommerceCodec: CommerceCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/bigcommerce',
    getAPI: (config: BigCommerceCodecConfiguration): CommerceAPI => {
        if (!config.store_hash) {
            return null
        }

        const fetch = async (url: string): Promise<any> => {
            let response = await axios.request({
                method: 'get',
                url,
                baseURL: `${config.api_url}/stores/${config.store_hash}`,
                headers: {
                    'X-Auth-Token'  : config.api_token,
                    'Accept'        : `application/json`,
                    'Content-Type'  : `application/json`
                }
            })

            if (url.indexOf('customer_groups') > -1) {
                return response.data
            }
            return response.data.data
        }

        const api = {
            getCategoryTree: () => fetch(`/v3/catalog/categories/tree`),
            getProducts: () => fetch(`/v3/catalog/products`),
            searchProducts: keyword => fetch(`/v3/catalog/products?keyword=${keyword}`),
            getProductById: id => fetch(`/v3/catalog/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/v3/catalog/products?categories:in=${cat.id}`),
            getCustomerGroups: () => fetch(`/v2/customer_groups`)
        }

        const getMegaMenu = async function (args: CommonArgs): Promise<Category[]> {
            return (await api.getCategoryTree()).map(mapCategory)
        }

        return {
            getProduct: async function (args: GetCommerceObjectArgs): Promise<Product> {
                if (args.id) {
                    return mapProduct(await api.getProductById(args.id))
                }
                throw new Error(`getProduct(): must specify id`)
            },
            getProducts: async function (args: GetProductsArgs): Promise<Product[]> {
                if (args.productIds) {
                    return await Promise.all(args.productIds.split(',').map(async (id) => mapProduct(await api.getProductById(id))))
                }
                else if (args.keyword) {
                    return (await api.searchProducts(args.keyword)).map(mapProduct)
                }
                throw new Error(`getProducts(): must specify either productIds or keyword`)
            },
            getCategory: async function (args: GetCommerceObjectArgs): Promise<Category> {
                if (!args.slug) {
                    throw new Error(`getCategory(): must specify slug`)
                }

                let category = findInMegaMenu(await getMegaMenu(args), args.slug)
                return {
                    ...category,
                    products: (await api.getProductsForCategory(category)).map(mapProduct)
                }
            },
            getMegaMenu,
            getCustomerGroups: async function (args: CommonArgs): Promise<CustomerGroup[]> {
                return (await api.getCustomerGroups()).map(mapCustomerGroup)
            }
        }
    }
}

export default bigCommerceCodec
registerCodec(bigCommerceCodec)