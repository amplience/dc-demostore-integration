// 3rd party libs
import _ from 'lodash'
import axios from 'axios'
import { Codec, registerCodec } from '../../../codec'
import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Product } from '../../../index'
import { BigCommerceCodecConfiguration } from './types'
import { mapProduct, mapCategory } from './mappers'
import { findInMegaMenu } from '../common'

const bigCommerceCodec: Codec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/bigcommerce',
    getAPI: async (config: BigCommerceCodecConfiguration): Promise<CommerceAPI> => {
        const fetch = async (url: string): Promise<any> => (await axios.request({
            method: 'get',
            url,
            baseURL: `${config.api_url}/stores/${config.store_hash}/v3/catalog`,
            headers: {
                'X-Auth-Token': config.api_token,
                'Content-Type': `application/json`
            }
        })).data.data

        const api = {
            getCategoryTree: () => fetch(`/categories/tree`),
            getProducts: () => fetch(`/products`),
            searchProducts: keyword => fetch(`/products?keyword=${keyword}`),
            getProductById: id => fetch(`/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/products?categories:in=${cat.id}`)
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

                let category = findInMegaMenu(await this.getMegaMenu(), args.slug)
                return {
                    ...category,
                    products: await api.getProductsForCategory(category)
                }
            },
            getMegaMenu: async function (args: CommonArgs): Promise<Category[]> {
                return (await api.getCategoryTree()).map(mapCategory)
            },
            getCustomerGroups: async function (args: CommonArgs): Promise<CustomerGroup[]> {
                return []
            }
        }
    },
    canUseConfiguration: function (config: any): boolean {
        return config.api_url && config.api_token && config.store_hash
    }
}

export default bigCommerceCodec
registerCodec(bigCommerceCodec)