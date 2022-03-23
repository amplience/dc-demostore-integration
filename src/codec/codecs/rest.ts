import _, { Dictionary } from 'lodash'
import { Product, Category, Variant, QueryContext, CategoryResults, ProductResults } from '../../types'
import { CodecConfiguration, Codec, registerCodec, CodecGenerator } from '..'
import { CommerceAPI } from '../..'
import { sleep } from '../../util'

const getAttribute = (variant: Variant, attributeName: string, defaultValue: string) => _.get(_.find(variant.attributes, att => att.name === attributeName), 'value') || defaultValue

export interface RestCommerceCodecConfig extends CodecConfiguration {
    productURL: string
    categoryURL: string
    translationsURL: string
}

const getCategoryIdsFromCategory = (category: Category): string[] => {
    let ids = [category.id]
    if (category.parent) {
        ids = _.concat(ids, getCategoryIdsFromCategory(category.parent))
    }
    return ids
}

let codec: RestCommerceCodec = undefined
let loading_state: number = 0

const topLevelCategorySlugs = ['women', 'men', 'accessories', 'new', 'sale']

let allCategories: Category[] = []
const bulldozeCategories = cat => {
    allCategories.push(cat)
    _.each(cat.children, bulldozeCategories)
}

let categories: Category[] = []
let products: Product[] = []
let translations: Dictionary<Dictionary<string>> = {}

const getProductsForCategory = (category: Category) => _.filter(products, prod => _.includes(_.map(prod.categories, 'id'), category.id))

class RestCommerceCodec extends Codec implements CommerceAPI {
    config: RestCommerceCodecConfig

    async start() {
        console.log(`[ rest-codec-${this.codecId} ] loading start...`)
        const startTime = new Date()

        products = await (await fetch(this.config.productURL)).json()
        categories = await (await fetch(this.config.categoryURL)).json()
        translations = await (await fetch(this.config.translationsURL)).json()

        // bulldoze the category array so we have them easily accessible
        _.each(categories, bulldozeCategories)

        // allCategories = allCategories.map(category => ({
        //     ...category,
        //     products: getProductsForCategory(category)
        // }))

        console.log(`[ rest-codec-${this.codecId} ] products loaded: ${products.length}`)
        console.log(`[ rest-codec-${this.codecId} ] categories loaded: ${categories.length}`)
        console.log(`[ rest-codec-${this.codecId} ] loading duration: ${new Date().getTime() - startTime.getTime()}`)
    }

    filterCategoryId = (category: Category) => (product: Product): boolean =>
        _.includes(_.flatMap(_.filter(categories, cat => _.includes(_.map(product.categories, 'id'), cat.id)), getCategoryIdsFromCategory), category.id)

    translatePrice = (price: string, context: QueryContext) =>
        new Intl.NumberFormat(context.getLocale(), { style: 'currency', currency: context.currency }).format(parseFloat(price))

    mapProduct = (context: QueryContext) => (product: Product) => {
        product.imageSetId = getAttribute(product.variants[0], 'articleNumberMax', '')
        _.each(product.variants, (variant: Variant) => {
            variant.articleNumberMax = getAttribute(variant, 'articleNumberMax', '')
            variant.size = getAttribute(variant, 'size', '')
            variant.color = getAttribute(variant, 'color', '')

            // map currency code
            variant.listPrice = variant.prices.list && this.translatePrice(variant.prices.list, context) || ''
            variant.salePrice = variant.prices.sale && this.translatePrice(variant.prices.sale, context) || ''
        })
        return product
    }

    mapCategory = (context: QueryContext, depth: number = 0) => (category: Category): Category => {
        category.products = _.take([
            ...getProductsForCategory(category),
            ..._.flatMap(category.children, getProductsForCategory)
        ], 12)
        return category
    }

    async getProduct(context: QueryContext): Promise<Product> {
        let product =
            context.args.id && _.find(products, prod => context.args.id === prod.id) ||
            context.args.key && _.find(products, prod => context.args.key === prod.slug) ||
            context.args.sku && _.find(products, prod => _.map(prod.variants, 'sku').includes(context.args.sku))
        if (product) {
            return this.mapProduct(context)(product)
        }
    }

    async getProducts(context: QueryContext): Promise<Product[]> {
        let filtered =
            context.args.productIds && _.filter(products, prod => context.args.productIds.split(',').includes(prod.id)) ||
            context.args.keyword && _.filter(products, prod => prod.name.toLowerCase().indexOf(context.args.keyword) > -1) ||
            context.args.categoryId && _.filter(products, prod => _.includes(_.map(prod.categories, 'id'), context.args.categoryId))

        if (!filtered) {
            throw new Error(`Products not found for args: ${JSON.stringify(context.args)}`)
        }
        return _.map(filtered, this.mapProduct(context))
    }

    async getCategory(context: QueryContext): Promise<Category> {
        let category = _.find(allCategories, cat => context.args?.id === cat.id || context.args?.key === cat.slug)
        if (!category) {
            throw new Error(`Category not found for args: ${JSON.stringify(context.args)}`)
        }
        return this.mapCategory(context)(category)
    }

    async getMegaMenu(): Promise<Category[]> {
        return _.filter(categories, cat => !cat.parent)
    }

    async getCategories(context: QueryContext): Promise<CategoryResults> {
        throw new Error(`[ aria ] RestCommerceCodec.getCategories() not yet implemented`)
    }
}

const getInstance = async (config: RestCommerceCodecConfig): Promise<RestCommerceCodec> => {
    if (codec && loading_state !== 1) {
        return codec
    }
    else if (loading_state === 0) {
        loading_state = 1
        codec = new RestCommerceCodec(config)
        await codec.start()
        loading_state = 2
        return codec
    }

    await sleep(100)
    return getInstance(config)
}

export default {
    // codec generator conformance
    SchemaURI: 'https://demostore.amplience.com/site/integration/rest',
    getInstance
    // end codec generator conformance
}
// registerCodec(RestCommerceCodec)