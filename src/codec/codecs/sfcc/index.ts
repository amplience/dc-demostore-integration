// 3rd party libs
import _ from 'lodash'
import axios from 'axios'
import { SFCCCategory, SFCCCustomerGroup, SFCCProduct } from './types'
import OAuthRestClient, { ClientCredentialProperties, ClientCredentialsConfiguration } from '../../../common/rest-client'
import { CodecPropertyConfig, CodecType, CommerceCodec, registerCodec, StringProperty } from '../../index'
import { CommerceAPI, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Category, Product, CommonArgs } from '../../../common'
import slugify from 'slugify'
import { formatMoneyString } from '../../../common/util'
import { findInMegaMenu } from '../common'

type CodecConfig = ClientCredentialsConfiguration & {
    api_token: StringProperty
    site_id: StringProperty
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
    metadata: {
        type:   CodecType.commerce,
        vendor: 'sfcc',
        properties
    },
    getAPI: async (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> => {
        const fetch = async (url: string): Promise<any> => {
            try {
                return (await axios.get(url, {
                    baseURL: config.api_url,
                    params: {
                        client_id: config.client_id
                    }
                })).data
            } catch (error) {
                console.log(`url ${url} status ${error.response?.status}`)
                if (error.response?.status === 404) {
                    return null
                }
                else {
                    throw error
                }
            }
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

        const shopApi = `/s/${config.site_id}/dw/shop/v22_4`
        const sitesApi = `/s/-/dw/data/v22_4/sites/${config.site_id}`
        const api = (args: CommonArgs) => ({
            getCategory: async (slug: string = 'root'): Promise<Category> => {
                return api(args).mapCategory(await fetch(`${shopApi}/categories/${slug}?levels=4`))
            },
            getCustomerGroups: async (): Promise<CustomerGroup[]> => {
                return (await authenticatedFetch(`${sitesApi}/customer_groups`)).map(api(args).mapCustomerGroup)
            },
            getProducts: async (productIds: string[]): Promise<Product[]> => {
                return await Promise.all(productIds.map(api(args).getProductById))
            },
            search: async (query: string): Promise<Product[]> => {
                let searchResults = (await fetch(`${shopApi}/product_search?${query}`)).hits
                if (searchResults) {
                    return await api(args).getProducts(searchResults.map(sr => sr.product_id))
                }
                return []
            },
            searchProducts: async (keyword: string): Promise<Product[]> => {
                return await api(args).search(`q=${keyword}`)
            },
            getProductsForCategory: async (cat: Category): Promise<Product[]> => {
                return await api(args).search(`refine_1=cgid=${cat.id}`)
            },
            getProductById: async (id: string): Promise<Product> => {
                return api(args).mapProduct(await fetch(`${shopApi}/products/${id}?expand=prices,options,images,variations`))
            },
            mapProduct: (product: SFCCProduct): Product => {
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
                        listPrice: formatMoneyString(variant.price, { currency: product.currency, locale: args.locale }),
                        salePrice: formatMoneyString(variant.price, { currency: product.currency, locale: args.locale }),
                        images,
                        attributes: variant.variation_values
                    })) || [{
                        sku: product.id,
                        listPrice: formatMoneyString(product.price, { currency: product.currency, locale: args.locale }),
                        salePrice: formatMoneyString(product.price, { currency: product.currency, locale: args.locale }),
                        images,
                        attributes: {}
                    }]
                }
            },
            mapCustomerGroup: (group: SFCCCustomerGroup): CustomerGroup => group && ({
                ...group,
                name: group.id
            }),
            mapCategory: (cat: SFCCCategory): Category => {
                if (!cat) { return null }
                return {
                    id: cat.id,
                    slug: cat.id,
                    name: cat.name,
                    children: cat.categories?.map(api(args).mapCategory) || [],
                    products: []
                }
            }
        })

        const megaMenu = await (await api({}).getCategory()).children
        return {
            getProduct: async function (args: GetCommerceObjectArgs): Promise<Product> {
                return await api(args).getProductById(args.id)
            },
            getProducts: async function (args: GetProductsArgs): Promise<Product[]> {
                if (args.productIds) {
                    return await api(args).getProducts(args.productIds.split(','))
                }
                else if (args.keyword) {
                    return await api(args).searchProducts(args.keyword)
                }
            },
            getCategory: async function (args: GetCommerceObjectArgs): Promise<Category> {
                // let category = await api(args).getCategory(args.slug)
                let category = findInMegaMenu(megaMenu, args.slug)
                if (category) {
                    return {
                        ...category,
                        products: await api(args).getProductsForCategory(category)
                    }    
                }
                return null
            },
            getMegaMenu: async function (): Promise<Category[]> {
                return megaMenu
            },
            getCustomerGroups: async function (): Promise<CustomerGroup[]> {
                return await api({}).getCustomerGroups()
            }
        }
    }
}
registerCodec(sfccCodec)