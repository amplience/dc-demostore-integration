import _ from 'lodash'
import { Product, Category, Variant, QueryContext } from '../../../types'
import { CommerceCodec, CodecConfiguration } from '../../../codec/codec'
import { CodecType, codecManager } from '../../../codec/codec-manager'
import { Dictionary } from 'lodash'

const getAttribute = (variant: Variant, attributeName: string) => _.get(_.find(variant.attributes, att => att.name === attributeName), 'value')

export interface RestCommerceCodecConfig extends CodecConfiguration {
    productURL: string
    categoryURL: string
    translationsURL: string
}

export class RestCommerceCodec extends CommerceCodec {
    categories: Category[] = []
    products: Product[] = []
    translations: Dictionary<Dictionary<string>> = {}

    async start() {
        console.log(`[ rest-codec-${this.codecId} ] loading start...`)
        const startTime = new Date()

        let restConfig = this.config as RestCommerceCodecConfig
        this.products = await (await fetch(restConfig.productURL)).json()
        this.categories = await (await fetch(restConfig.categoryURL)).json()
        this.translations = await (await fetch(restConfig.translationsURL)).json()

        console.log(`[ rest-codec-${this.codecId} ] products loaded: ${this.products.length}`)
        console.log(`[ rest-codec-${this.codecId} ] categories loaded: ${this.categories.length}`)

        const duration = new Date().getTime() - startTime.getTime()
        console.log(`[ rest-codec-${this.codecId} ] loading duration: ${duration}`)
    }

    translatePrice = (price: string, context: QueryContext) =>
        new Intl.NumberFormat(context.getLocale(), { style: 'currency', currency: context.currency }).format(parseFloat(price))

    mapProduct = (context: QueryContext) => (product: Product) => {
        product.imageSetId = getAttribute(product.variants[0], 'articleNumberMax')
        _.each(product.variants, (variant: Variant) => {
            _.each(variant.attributes, (value, key) => {
                variant.articleNumberMax = getAttribute(variant, 'articleNumberMax') || ''
                variant.size = getAttribute(variant, 'size') || ''
                variant.color = getAttribute(variant, 'color') || ''
            })

            // map currency code
            variant.listPrice = variant.prices.list && this.translatePrice(variant.prices.list, context) || ''
            variant.salePrice = variant.prices.sale && this.translatePrice(variant.prices.sale, context) || ''
        })
        return product
    }

    mapCategory = (context: QueryContext, depth: number = 0) => (category?: Category): Category => {
        if (!category) {
            throw new Error(`Category not found`)
        }

        const getCategoryIdsFromCategory = (category: Category): string[] => {
            let ids = [category.id]
            if (category.parent) {
                ids = _.concat(ids, getCategoryIdsFromCategory(category.parent))
            }
            return ids
        }

        const filterCategoryId = (product: Product): boolean =>
            _.includes(_.flatMap(_.filter(this.categories, cat => _.includes(_.map(product.categories, 'id'), cat.id)), getCategoryIdsFromCategory), category.id)

        const trimVariants = (prod: Product) => ({
            ...prod,
            variants: prod.variants.length > 0 ? [_.first(prod.variants)!] : []
        })

        // remove all but the first variant since if this is for a category mapping
        let products = depth === 0 && !!context.args?.includeProducts ?
            _.take(_.filter(_.map(this.products, trimVariants), filterCategoryId), context.args.limit || 12) : 
            []

        // search for name matching 'query' if it was provided
        products = _.filter(products, prod => _.isEmpty(context.args.query) || prod.name.toLowerCase().indexOf(context.args.query.toLowerCase()) > -1)

        return {
            ...category,
            children: depth < 2 ? _.map(category.children, this.mapCategory(context, depth + 1)) : [],
            name: this.translations[category.name][`${context.language}-${context.country}`] || category.name,
            products: _.map(products, this.mapProduct(context))
        }
    }

    // yes!
    async getProduct(context: QueryContext) {
        let product =
            context.args.id && _.find(this.products, prod => context.args.id === prod.id) ||
            context.args.key && _.find(this.products, prod => context.args.key === prod.slug) ||
            context.args.sku && _.find(this.products, prod => _.map(prod.variants, 'sku').includes(context.args.sku))
        if (!product) {
            throw new Error(`Product not found for args: ${JSON.stringify(context.args)}`)
        }
        return this.mapProduct(context)(product)
    }

    // yes!
    async getProducts(context: QueryContext) {
        let products = 
            context.args.productIds && _.filter(this.products, prod => context.args.productIds.split(',').includes(prod.id)) ||
            context.args.keyword && _.filter(this.products, prod => prod.name.toLowerCase().indexOf(context.args.keyword) > -1)

        if (!products) {
            throw new Error(`Products not found for args: ${JSON.stringify(context.args)}`)
        }
        return {
            meta: context.args.limit && {
                limit: context.args.limit,
                count: context.args.count,
                offset: context.args.offset,
                total: context.args.total
            },
            results: _.map(products, this.mapProduct(context))
        }
    }

    // yes!
    async getCategory(context: QueryContext) {
        let category = _.find(this.categories, cat => context.args?.id === cat.id || context.args?.key === cat.slug)
        if (!category) {
            throw new Error(`Category not found for args: ${JSON.stringify(context.args)}`)
        }
        return this.mapCategory(context)(category)
    }
}

const type: CodecType = {
    vendor: 'rest',
    codecType: 'commerce',

    validate: (x: any) => {
        return x._meta.schema === 'https://amprsa.net/site/integration/rest'
    },

    create: (config: RestCommerceCodecConfig) => {
        return new RestCommerceCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)