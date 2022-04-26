// 3rd party libs
import _ from 'lodash'
import axios from 'axios'
import { Codec, CodecConfiguration, CommerceCodec, registerCodec } from '../../../codec'
import { Category, CommerceAPI, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, OAuthRestClient, Product, QueryContext } from '../../../index'
import { SFCCCategory, SFCCCustomerGroup } from './types'
import { OAuthCodecConfiguration } from '../../../common/rest-client'

export interface SFCCCodecConfiguration extends OAuthCodecConfiguration {
    api_token: string
    site_id: string
    client_id: string
    client_secret: string
}

const sfccCodec: CommerceCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/sfcc',
    getAPI: (config: SFCCCodecConfiguration): CommerceAPI => {
        const fetch = async (url: string): Promise<any> => {
            console.log(`fetch ${config.api_url}${url}&client_id=${config.client_id}`)
            return (await axios.get(url, {
                baseURL: config.api_url,
                params: {
                    client_id: config.client_id
                }
            })).data
        }

        // authenticated fetch based on oauth creds passed in (not needed for store apis)
        let rest = OAuthRestClient({
            ...config,
            auth_url: `${config.auth_url}?grant_type=client_credentials`
        },
            {},
            {
                headers: {
                    Authorization: 'Basic ' + config.api_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        const authenticatedFetch = async url => (await rest.get({ url })).data
        // end authenticated fetch

        const api = {
            getCategory: async (slug: string = 'root'): Promise<Category> => {
                return api.mapCategory(await fetch(`/s/${config.site_id}/dw/shop/v20_4/categories/${slug}?levels=4`))
            },
            getCustomerGroups: async (): Promise<CustomerGroup[]> => {
                return (await authenticatedFetch(`/s/-/dw/data/v22_4/sites/${config.site_id}/customer_groups`)).map(api.mapCustomerGroup)
            },
            getProducts: () => fetch(`/products`),
            searchProducts: keyword => fetch(`/products?keyword=${keyword}`),
            getProductById: id => fetch(`/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/products?categories:in=${cat.id}`),
            mapCustomerGroup: (group: SFCCCustomerGroup): CustomerGroup => ({
                ...group,
                name: group.id
            }),
            mapCategory: (cat: SFCCCategory): Category => ({
                id: cat.id,
                slug: cat.id,
                name: cat.name,
                image: { url: cat.image },
                children: cat.categories?.map(api.mapCategory) || [],
                products: []
            })
        }

        return {
            getProduct: async function (args: GetCommerceObjectArgs): Promise<Product> {
                // if (query.args.id) {
                //     return mapProduct(await api.getProductById(query.args.id))
                // }
                throw new Error(`getProduct(): must specify id`)
            },
            getProducts: async function (args: GetProductsArgs): Promise<Product[]> {
                // if (query.args.productIds) {
                //     return await Promise.all(query.args.productIds.split(',').map(async id => mapProduct(await api.getProductById(id))))
                // }
                // else if (query.args.keyword) {
                //     return (await api.searchProducts(query.args.keyword)).map(mapProduct)
                // }
                throw new Error(`getProducts(): must specify either productIds or keyword`)
            },
            getCategory: async function (args: GetCommerceObjectArgs): Promise<Category> {
                if (!args.slug) {
                    throw new Error(`getCategory(): must specify slug`)
                }

                let category = await api.getCategory(args.slug)
                return {
                    ...category,
                    products: await api.getProductsForCategory(category)
                }
            },
            getMegaMenu: async function (): Promise<Category[]> {
                return await (await api.getCategory()).children
            },
            getCustomerGroups: async function (): Promise<CustomerGroup[]> {
                return await api.getCustomerGroups()
            }
        }
    },
    canUseConfiguration: function (config: any): boolean {
        return config.client_id && config.client_secret && config.site_id && config.auth_url && config.api_url && config.api_token
    }
}

export default sfccCodec
registerCodec(sfccCodec)