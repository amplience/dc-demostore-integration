import _, { Dictionary } from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../../types'
import { CodecStringConfig, CommerceCodec, StringProperty } from '../..'
import { CommerceAPI } from '../../..'
import mappers from './mappers'
import { CodecType } from '../../index'

type CodecConfig = {
    productURL: StringProperty
    categoryURL: StringProperty
    customerGroupURL: StringProperty
    translationsURL: StringProperty
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

const restCodec: CommerceCodec = {
    schema: {
        type: CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/rest',
        icon: 'https://cdn-icons-png.flaticon.com/512/180/180954.png',
        properties
    },
    getAPI: async function (config: CodecStringConfig<CodecConfig>): Promise<CommerceAPI> {
        const categories: Category[] = await fetchFromURL(config.categoryURL, [])
        const products: Product[] = await fetchFromURL(config.productURL, [])
        const customerGroups: CustomerGroup[] = await fetchFromURL(config.customerGroupURL, [])
        const translations: Dictionary<Dictionary<string>> = await fetchFromURL(config.translationsURL, {})

        const api = {
            getProductsForCategory: (category: Category): Product[] => {
                let categoryProducts = _.filter(products, prod => _.includes(_.map(prod.categories, 'id'), category.id))
                if (_.isEmpty(categoryProducts)) {
                    categoryProducts = _.flatMap(category.children.map(api.getProductsForCategory))
                }
                return categoryProducts
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

        return {
            getProduct: async function (args: GetCommerceObjectArgs): Promise<Product> {
                let product = api.getProduct(args)
                if (product) {
                    return mappers.mapProduct(product, args)
                }
            },
            getProducts: async function (args: GetProductsArgs): Promise<Product[]> {
                let filtered: Product[] = api.getProducts(args)
                if (filtered) {
                    return filtered.map(prod => mappers.mapProduct(prod, args))
                }
                return null
            },
            getCategory: async function (args: GetCommerceObjectArgs): Promise<Category> {
                let category = api.getCategory(args)
                if (category) {
                    return mappers.mapCategory(api.populateCategory(category))
                }
                return null
            },
            getMegaMenu: async function (): Promise<Category[]> {
                return categories.filter(cat => !cat.parent).map(mappers.mapCategory)
            },
            getCustomerGroups: async function (): Promise<CustomerGroup[]> {
                return api.getCustomerGroups()
            }
        }
    }
}
export default restCodec