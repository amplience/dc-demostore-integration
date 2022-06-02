import _, { Dictionary } from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../../types'
import { CodecStringConfig, StringProperty } from '../..'
import { CommerceAPI } from '../../..'
import mappers from './mappers'
import { findInMegaMenu } from '../common'

type CodecConfig = {
    productURL:         StringProperty
    categoryURL:        StringProperty
    customerGroupURL:   StringProperty
    translationsURL:    StringProperty
}

const properties: CodecConfig = {
    productURL: {
        title: "Product file URL",
        type: "string"
    },
    categoryURL: {
        title: "Category file URL",
        type: "string"
    },
    customerGroupURL: {
        title: "Customer group file URL",
        type: "string"
    },
    translationsURL: {
        title: "Translations file URL",
        type: "string"
    }
}

const fetchFromURL = async (url: string, defaultValue: any) => _.isEmpty(url) ? defaultValue : await (await fetch(url)).json()

const restCodec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/rest',
        icon: 'https://cdn-icons-png.flaticon.com/512/180/180954.png',
        properties
    },
    getAPI: function (config: CodecStringConfig<CodecConfig>): CommerceAPI {
        if (!config.productURL) {
            return null
        }

        let categories: Category[] = []
        let products: Product[] = []
        let customerGroups: CustomerGroup[] = []
        let translations: Dictionary<Dictionary<string>> = {}
        let api = null

        const loadAPI = async () => {
            if (_.isEmpty(products)) {
                products = await fetchFromURL(config.productURL, [])
                categories = await fetchFromURL(config.categoryURL, [])
                customerGroups = await fetchFromURL(config.customerGroupURL, [])
                translations = await fetchFromURL(config.translationsURL, {})
            }

            api = {
                getProductsForCategory: (category: Category): Product[] => {
                    return [
                        ..._.filter(products, prod => _.includes(_.map(prod.categories, 'id'), category.id)),
                        ..._.flatMap(category.children.map<Product[]>(api.getProductsForCategory))
                    ]
                },
                getProduct: (args: GetCommerceObjectArgs) => {
                    return args.id && _.find(products, prod => args.id === prod.id) ||
                        args.slug && _.find(products, prod => args.slug === prod.slug)
                },
                getProducts: (args: GetProductsArgs): Product[] => {
                    let productIds: string[] = args.productIds?.split(',')
                    return productIds && _.filter(products, prod => productIds.includes(prod.id)) ||
                        args.keyword && _.filter(products, prod => prod.name.toLowerCase().indexOf(args.keyword) > -1)
                },
                getCategory: (args: GetCommerceObjectArgs) => {
                    let category = categories.find(cat => cat.slug === args.slug)
                    if (category) {
                        return api.populateCategory(category)
                    }
                    return null
                },
                populateCategory: (category: Category): Category => ({
                    ...category,
                    products: _.take(api.getProductsForCategory(category), 20)
                }),
                getCustomerGroups: (): CustomerGroup[] => {
                    return customerGroups
                }
            }
        }

        return {
            getProduct: async function (args: GetCommerceObjectArgs): Promise<Product> {
                await loadAPI()
                let product = api.getProduct(args)
                if (product) {
                    return mappers.mapProduct(product, args)
                }
            },
            getProducts: async function (args: GetProductsArgs): Promise<Product[]> {
                await loadAPI()
                let filtered: Product[] = api.getProducts(args)
                if (filtered) {
                    return filtered.map(prod => mappers.mapProduct(prod, args))
                }
                return null
            },
            getCategory: async function (args: GetCommerceObjectArgs): Promise<Category> {
                await loadAPI()
                let category = api.getCategory(args)
                if (category) {
                    return mappers.mapCategory(api.populateCategory(category))
                }
                return null
            },
            getMegaMenu: async function (): Promise<Category[]> {
                await loadAPI()
                return categories.filter(cat => !cat.parent).map(mappers.mapCategory)
            },
            getCustomerGroups: async function (): Promise<CustomerGroup[]> {
                await loadAPI()
                return api.getCustomerGroups()
            }
        }
    }
}
export default restCodec