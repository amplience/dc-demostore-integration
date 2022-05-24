import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../../common/types'
import { CodecPropertyConfig, CommerceCodec, registerCodec, StringProperty } from '../..'
import { ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, OAuthRestClient, UsernamePasswordConfiguration, UsernamePasswordProperties } from '../../..'
import { CodecType } from '../../index'
import { findInMegaMenu } from '../common'
import slugify from 'slugify'
import btoa from 'btoa'
import { AkeneoCategory, AkeneoProduct, AkeneoProperty } from './types'

type CodecConfig = UsernamePasswordConfiguration & ClientCredentialsConfiguration & {
    rootCategory: StringProperty
}

const properties: CodecConfig = {
    ...UsernamePasswordProperties,
    ...ClientCredentialProperties,
    rootCategory: {
        title: "Root category ID",
        type: "string"
    }
}

const akeneoCodec: CommerceCodec = {
    schema: {
        type: CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/akeneo',
        icon: 'https://static.crozdesk.com/web_app_library/providers/logos/000/006/691/original/akeneo-pim-1559230789-logo.png?1559230789',
        properties
    },
    getAPI: async function (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        const rest = OAuthRestClient({
            api_url: `${config.api_url}/api/rest/v1`,
            auth_url: `${config.api_url}/api/oauth/v1/token`
        }, {
            username: config.username,
            password: config.password,
            grant_type: "password"
        }, {
            headers: {
                Authorization: `Basic ${btoa(`${config.client_id}:${config.client_secret}`)}`
            }
        }, (auth: any) => ({
            Authorization: `Bearer ${auth.access_token}`
        }))
        const fetch = async url => {
            let result = await rest.get({ url })
            return result._embedded ? result._embedded.items : result 
        }

        let categories: AkeneoCategory[] = await fetch('/categories')

        const mapCategory = (category: AkeneoCategory): Category => ({
            id: category.code,
            name: category.labels['en_US'],
            slug: category.code,
            children: [],
            products: []
        })
        
        const findValue = (values: AkeneoProperty[]) => values && values.find(value => !value.locale || value.locale === 'en_US').data

        const mapProduct = (product: AkeneoProduct): Product => ({
            id: product.identifier,
            name: findValue(product.values.name),
            slug: product.values.name && slugify(findValue(product.values.name), { lower: true }),
            shortDescription: findValue(product.values.description),
            longDescription: findValue(product.values.description),
            categories: [],
            variants: [{
                sku: product.identifier,
                listPrice: '0.00',
                salePrice: '0.00',
                images: [],
                attributes: _.mapValues(product.values, findValue)
            }]
        })
        
        // 'master' is the catalog root node, so top-level categories its children
        let megaMenu: Category[] = []
        categories.forEach(cat => {
            if (cat.code === 'master') {
                // top level category
                megaMenu.push(mapCategory(cat))
            }
            else {
                // try to find in the megamenu
                let parent = findInMegaMenu(megaMenu, cat.parent)
                if (parent) {
                    parent.children.push(mapCategory(cat))
                }
            }
        })

        megaMenu = findInMegaMenu(megaMenu, config.rootCategory === '' ? 'master' : config.rootCategory).children

        const api = {
            getProductById: async (id: string): Promise<Product> => {
                return mapProduct(await fetch(`/products/${id}`))
            },
            getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
                return await api.getProductById(args.id)
            },
            getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
                if (args.productIds) {
                    return await Promise.all(args.productIds.split(',').map(api.getProductById))
                }
                else if (args.keyword) {
                    let searchResults = await fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`)
                    return searchResults.map(mapProduct)
                }
            },
            getCategory: async (args: GetCommerceObjectArgs) => {
                return await api.populateCategory(findInMegaMenu(megaMenu, args.slug))
            },
            populateCategory: async (category: Category): Promise<Category> => {
                let products = await fetch(`/products?search={"categories":[{"operator":"IN","value":["${category.id}"]}]}`)
                category.products = products.map(mapProduct)
                return category
            },
            getMegaMenu: async (): Promise<Category[]> => {
                return megaMenu
            },
            getCustomerGroups: async (): Promise<CustomerGroup[]> => {
                return []
            }
        }
        return api
    }
}
registerCodec(akeneoCodec)