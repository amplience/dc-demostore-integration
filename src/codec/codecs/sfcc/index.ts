// 3rd party libs
import _ from 'lodash'
import axios from 'axios'
import { Category, Codec, CodecStringConfig, CommerceAPI, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, OAuthRestClient, Product, StringProperty } from '../../../index'
import { SFCCCategory, SFCCCustomerGroup } from './types'
import { ClientCredentialProperties, ClientCredentialsConfiguration, OAuthCodecConfiguration, OAuthProperties } from '../../../common/rest-client'

type CodecConfig = OAuthCodecConfiguration & ClientCredentialsConfiguration & {
    api_token:  StringProperty
    site_id:    StringProperty
}

const properties: CodecConfig = {
    ...OAuthProperties,
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

const sfccCodec: Codec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/sfcc',
        icon: 'https://www.pikpng.com/pngl/b/321-3219605_salesforce-logo-png-clipart.png',
        properties
    },
    getAPI: (config: CodecStringConfig<CodecConfig>): CommerceAPI => {
        if (!config.api_token) {
            return null
        }

        const fetch = async (url: string): Promise<any> => {
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
    }
}
export default sfccCodec