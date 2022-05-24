// 3rd party libs
import _ from 'lodash'
import axios from 'axios'
import { SFCCCategory, SFCCCustomerGroup, SFCCProduct } from './types'
import OAuthRestClient, { ClientCredentialProperties, ClientCredentialsConfiguration } from '../../../common/rest-client'
import { CodecPropertyConfig, CodecType, CommerceCodec, registerCodec, StringProperty } from '../../index'
import { CommerceAPI, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Category, Product } from '../../../common'
import slugify from 'slugify'

type CodecConfig = ClientCredentialsConfiguration & {
    api_token:  StringProperty
    site_id:    StringProperty
}

const properties: CodecConfig = {
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

const sfccCodec: CommerceCodec = {
    schema: {
        type: CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/sfcc',
        icon: 'https://www.pikpng.com/pngl/b/321-3219605_salesforce-logo-png-clipart.png',
        properties
    },
    getAPI: async (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> => {
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
                return api.mapCategory(await fetch(`/s/${config.site_id}/dw/shop/v22_4/categories/${slug}?levels=4`))
            },
            getCustomerGroups: async (): Promise<CustomerGroup[]> => {
                return (await authenticatedFetch(`/s/-/dw/data/v22_4/sites/${config.site_id}/customer_groups`)).map(api.mapCustomerGroup)
            },
            getProducts: async id => {

            },
            searchProducts: async keyword => {
                return api.mapCategory(await fetch(`/s/${config.site_id}/dw/shop/v22_4/product_search?q=${keyword}`))
            },
            getProductById: id => fetch(`/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/products?categories:in=${cat.id}`),
            mapProduct: (product: SFCCProduct): Product => {
                return {
                    ...product,
                    slug: slugify(product.name, { lower: true }),
                    shortDescription: product.short_description,
                    longDescription: product.long_description,
                    categories: [],
                    variants: product.variants.map(variant => {
                        return {
                            sku: variant.product_id,
                            listPrice: `${variant.price}`,
                            salePrice: `${variant.price}`,
                            images: [],
                            attributes: {}
                        }
                    })
                }
            },
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

        const megaMenu = await (await api.getCategory()).children
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
                return megaMenu
            },
            getCustomerGroups: async function (): Promise<CustomerGroup[]> {
                return await api.getCustomerGroups()
            }
        }
    }
}
registerCodec(sfccCodec)