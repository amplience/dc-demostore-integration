import _ from 'lodash'
import URI from 'urijs'
import axios from 'axios'
import currency from 'currency.js'

import { Operation } from './operation'
import { Attribute, Category, CategoryResults, Product, ProductResults, QueryContext } from '../../../types'
import { Codec, CodecConfiguration, registerCodec } from '../../../codec'
import { CommerceAPI } from '../../../index'
import { formatMoneyString } from '../../../util'

const getAttributeValue = (attributes: Attribute[] = [], name: string) => {
    return _.get(_.find(attributes, att => att.name === name), 'value')
}

export interface CommerceToolsCodecConfiguration extends CodecConfiguration {
    client_id:      string
    client_secret:  string
    auth_url:       string
    api_url:        string
    project:        string
    scope:          string
}

class CommerceToolsCodec extends Codec implements CommerceAPI {
    productOperation: Operation
    categoryOperation: Operation

    constructor(config: CodecConfiguration) {
        super(config)
        this.productOperation = new CommerceToolsProductOperation(config)
        this.categoryOperation = new CommerceToolsCategoryOperation(config)
    }

    async getMegaMenu(): Promise<Category[]> {
        return await this.getCategoryHierarchy(new QueryContext({ args: { categorySlugs: ['women', 'men', 'accessories', 'sale', 'new'] } }))
    }

    async getProduct(query: QueryContext): Promise<Product> {
        return await this.productOperation.get(query)
    }

    async getProducts(query: QueryContext): Promise<Product[]> {
        return await this.productOperation.get(query)
    }

    async getCategoryHierarchy(query: QueryContext) {
        let filter =
            query.args.id && ((c: Category) => c.id === query.args.id) ||
            query.args.slug && ((c: Category) => c.slug === query.args.slug) ||
            query.args.key && ((c: Category) => c.key === query.args.key) ||
            query.args.categorySlugs && ((c: Category) => _.includes(query.args.categorySlugs, c.slug)) ||
            ((c: Category) => !c.parent?.id)

        let categories = _.get(await this.categoryOperation.get(new QueryContext({ ...query, args: {} })), 'results')
        let populateChildren = (category: Category) => {
            category.children = _.filter(categories, (c: Category) => c.parent && c.parent.id === category.id)
            _.each(category.children, populateChildren)
            return category
        }

        let x = _.map(_.filter(categories, filter), populateChildren)
        return x
    }

    async getCategories(query: QueryContext): Promise<CategoryResults> {
        throw new Error(`[ aria ] CommerceToolsCodec.getCategories() not yet implemented`)
        // return await this.getCategoryHierarchy(query)
    }

    async getCategory(query: QueryContext): Promise<Category> {
        let x: any = _.find(await this.getCategoryHierarchy(query), (c: Category) => c.id === query.args.id || c.slug === query.args.slug || c.key === query.args.key)
        if (x) {
            x.products = await this.getProductsForCategory(x, query)
        }
        return x
    }

    async getProductsForCategory(parent: Category, query: QueryContext) {
        return (await this.productOperation.get(new QueryContext({
            ...query,
            args: { filter: `categories.id: subtree("${parent.id}")` }
        }))).results
    }
}

const mapImage = (image: any) => image && ({ url: image.url })

class CommerceToolsOperation extends Operation {
    config: CommerceToolsCodecConfiguration
    accessToken?: string

    getBaseURL() {
        return `${this.config.api_url}/${this.config.project}/`
    }

    getURL(context: QueryContext) {
        return `${this.getBaseURL()}${this.getRequestPath(context)}`
    }

    getRequest(context: QueryContext) {
        let uri = new URI(this.getURL(context))

        let query = {
            limit: context.args.limit,
            offset: context.args.offset,
            where: context.args.where,
            filter: context.args.filter,
            ...context.args,
        }

        // add any filters based on the args
        uri.addQuery(query)

        return uri.toString()
    }

    localize(text: any, context: QueryContext) {
        if (!text) {
            console.error(new Error().stack)
        }

        if (text.label) {
            text = text.label
        }

        if (typeof text === 'string') {
            return text
        }

        if (typeof text === 'boolean') {
            let b: Boolean = text
            return b
        }

        let localized = text[context.language] || text['en'] || text[Object.keys(text)[0]]

        // if (_.isEmpty(localized)) {
        //     console.log(`localize: ${JSON.stringify(text)}`)
        // }

        return localized
    }

    async authenticate() {
        if (!this.accessToken) {
            let response: any = await axios.post(
                `${this.config.auth_url}/oauth/token?grant_type=client_credentials&scope=${_.first(_.split(this.config.scope, ' '))}`, {}, {
                auth: {
                    username: this.config.client_id,
                    password: this.config.client_secret
                }
            })
            this.accessToken = `${response.data.token_type} ${response.data.access_token}`
        }
        return this.accessToken
    }

    async translateResponse(data: any, mapper = ((x: any) => x)) {
        // a commercetools response will be either a single object, or an array in 'results'
        // if it is an array, limit, count, total, and offset are provided on the object

        let r = data.results || [data]
        return {
            meta: data.limit && {
                limit: data.limit,
                count: data.count,
                offset: data.offset,
                total: data.total
            },
            results: await Promise.all(r.map(await mapper))
        }
    }

    async getHeaders() {
        return { authorization: await this.authenticate() }
    }
}

// category operation
class CommerceToolsCategoryOperation extends CommerceToolsOperation {
    export(context: QueryContext) {
        let self = this
        return function (category: any) {
            return {
                id: category.id,
                parent: category.parent || {},
                ancestors: category.ancestors,
                name: self.localize(category.name, context),
                slug: self.localize(category.slug, context),
                key: category.slug.en
            }
        }
    }

    getRequestPath(context: QueryContext) {
        return context.args.key ? `categories/key=${context.args.key}` : `categories`
    }

    async get(context: QueryContext) {
        return await super.get(new QueryContext({
            ...context,
            args: {
                ...context.args,
                limit: 500,
                where:
                    context.args.slug && [`slug(${context.language || 'en'}="${context.args.slug}") or slug(en="${context.args.slug}")`] ||
                    context.args.id && [`id="${context.args.id}"`]
            }
        }))
    }
}
// end category operations

// cart discount operation
class CommerceToolsCartDiscountOperation extends CommerceToolsOperation {
    getRequestPath(context: QueryContext) {
        return `cart-discounts`
    }
}
// end cart discount operations

// product operation
class CommerceToolsProductOperation extends CommerceToolsOperation {
    getRequestPath(context: QueryContext) {
        if (context.args.keyword || context.args.filter) {
            return `product-projections/search`
        }
        else {
            return context.args.key ? `product-projections/key=${context.args.key}` : `product-projections`
        }
    }

    async get(context: QueryContext) {
        if (context.args.all) {
            let getCategories = async (limit: number, offset: number) => {
                return await super.get({
                    ...context.args,
                    limit,
                    offset,
                    expand: ['categories[*]'],
                })
            }

            let results: any[] = []
            let total = -1

            while (total === -1 || results.length < total) {
                let response = await getCategories(100, results.length)
                results = results.concat(response.results)
                total = response.meta.total

                console.log(`[ ct ] retrieved products: ${results.length}/${total}`)
            }

            return {
                meta: {
                    total: results.length,
                    count: results.length
                },
                results
            }
        }
        else {
            return await super.get(new QueryContext({
                ...context,
                args: {
                    expand: ['categories[*]'],
                    priceCountry: context.country,
                    priceCurrency: context.currency,
                    [`text.${context.language}`]: context.args.keyword,
                    filter:
                        context.args.filter ||
                        context.args.productIds && [`id:${_.map(context.args.productIds.split(','), (x: any) => `"${x}"`).join(',')}`],
                    where:
                        context.args.id && [`id="${context.args.id}"`] ||
                        context.args.slug && [`slug(${context.language}="${context.args.slug}") or slug(en="${context.args.slug}")`] ||
                        context.args.sku && [`variants(sku="${context.args.sku}")`]
                }
            }))
        }
    }

    async post(context: QueryContext) {
        context.args = {
            ...context.args,
            body: this.import(context.args.product)
        }
        return await super.post(context)
    }

    export(context: QueryContext) {
        let self = this
        return function (product: any) {
            return {
                id: product.id,
                name: self.localize(product.name, context),
                slug: self.localize(product.slug, context),
                // longDescription: product.metaDescription && self.localize(product.metaDescription, context),
                imageSetId: getAttributeValue(product.variants[0]?.attributes, 'articleNumberMax'),
                variants: _.map(_.concat(product.variants, [product.masterVariant]), (variant: any) => {
                    return {
                        sku: variant.sku || product.key,
                        prices: {
                            list: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, context),
                            sale: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, context)
                        },
                        images: _.map(variant.images, mapImage),
                        attributes: _.map(variant.attributes, (att: any) => ({ name: att.name, value: self.localize(att.value, context) }))
                    }
                }),
                categories: _.map(product.categories, function (cat: any) {
                    let category = cat.obj || cat
                    return {
                        id: category.id,
                        parent: category.parent,
                        ancestors: category.ancestors
                    }
                }),
                productType: product.productType.id,
                key: product.slug.en
            }
        }
    }

    postProcessor(context: QueryContext) {
        let self = this
        return async function (products: any[]) {
            let segment = context.segment
            if (!_.isEmpty(segment) && segment !== 'null' && segment !== 'undefined') {
                let discountOperation = new CommerceToolsCartDiscountOperation(self.config)
                let cartDiscounts = (await discountOperation.get(new QueryContext())).results
                let applicableDiscounts = _.filter(cartDiscounts, (cd: any) => cd.cartPredicate === `customer.customerGroup.key = "${segment.toUpperCase()}"`)

                return _.map(products, (product: any) => {
                    return {
                        ...product,
                        variants: _.map(product.variants, (variant: any) => {
                            let sale = currency(variant.prices.list).value
                            _.each(applicableDiscounts, (discount: any) => {
                                if (discount.target.type === 'lineItems') {
                                    let [predicateKey, predicateValue] = discount.target.predicate.split(" = ")
                                    if (discount.target.predicate === '1 = 1' || (predicateKey === 'productType.id' && `"${product.productType}"` === predicateValue)) {
                                        if (discount.value.type === 'relative') {
                                            // permyriad is pct off * 10000
                                            sale = sale * (1 - discount.value.permyriad / 10000)
                                        }
                                    }
                                }
                            })

                            variant.prices.sale = currency(sale).format()
                            return variant
                        })
                    }
                })
            }
            else {
                return products
            }
        }
    }
}

export default {
    // codec generator conformance
    SchemaURI: 'https://amprsa.net/site/integration/commercetools',
    getInstance: async (config) => {
        return new CommerceToolsCodec(config)
    }
    // end codec generator conformance
}