import _ from 'lodash'
import fetch from 'cross-fetch'
import URI from 'urijs'

export class Prices {
    sale?: string
    list?: string
}

export class ProductImage {
    url: string
    large?: string
    thumb?: string
}

export class ResultsMeta {
    limit: number
    offset: number
    count: number
    total: number
}

export class ProductResults {
    meta: ResultsMeta
    results: [Product]
}

export class CategoryResults {
    meta: ResultsMeta
    results: [Category]
}

export class Identifiable {
    id: string
}

export class Keyed extends Identifiable {
    key: string
}

export class CommerceObject extends Keyed {
    slug: string
    name: string
}

export class Product extends CommerceObject {
    shortDescription?: string
    longDescription?: string
    imageSetId?: string
    categories: Category[]
    variants: Variant[]
    productType: string
}

export class Attribute {
    name: string
    value: string
}

export class Variant extends Keyed {
    sku: string
    prices: Prices
    listPrice: string
    salePrice: string
    defaultImage?: ProductImage
    images: ProductImage[]
    attributes: Attribute[]

    color?: string
    size?: string
    articleNumberMax?: string
}

export class Category extends CommerceObject {
    parent?: Category
    children: Category[]
    products: Product[]
}

export class SearchResult {
    products: Product[]
}

export type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
}

export class CommonArgs {
}

export class ListArgs extends CommonArgs {
    limit?: number
    offset?: number
}

export class Context {
    backendKey?: string
}

export class GetCategoryArgs extends CommonArgs {
    id?: string
    slug?: string
}

export class GetCategoryProductArgs extends CommonArgs {
    full?: boolean
    segment?: string
}

export class GetProductsArgs extends ListArgs {
    keyword?: string
    segment?: string
    productIds?: string
}

export class GetProductArgs extends CommonArgs {
    id?: string
    sku?: string
    slug?: string
    segment?: string
}

export class GetAttributeArgs {
    name: string
}

export class QueryContext {
    args:       any
    locale:     string
    language:   string
    country:    string
    currency:   string
    segment:    string
    appUrl:     string
    method:     string = 'get'

    constructor(obj?: any) {
        this.args =     obj?.args || {}
        this.locale =   obj?.locale || 'en-US'
        this.language = obj?.language || 'en'
        this.country =  obj?.country || 'US'
        this.currency = obj?.currency || 'USD'
        this.segment =  obj?.segment || ''
        this.appUrl =   obj?.appUrl || ''
    }

    getLocale(): string {
        return this.locale || `${this.language}-${this.country}`
    }

    async fetch(url: string) {
        let uri = new URI(url)
        uri.addQuery(this.args)
        console.log(`[ aria ] fetch ${uri.toString()}`)
        let start = new Date().valueOf()
        let results = (await (await fetch(uri.toString(), {
            headers: {
                'x-aria-locale':    this.locale,
                'x-aria-language':  this.language,
                'x-aria-country':   this.country,
                'x-aria-currency':  this.currency,
                'x-aria-segment':   this.segment,
                'x-aria-app-url':   this.appUrl
            }
        })).json())

        console.log(`[ aria ] fetch [ ${url} ]: ${new Date().valueOf() - start} ms`)
        return results
    }
}

export function createQueryContext(req) {
    return new QueryContext({
        args:       _.omit(req.query, 'operation'),
        locale:     req.headers['x-aria-locale'],
        language:   req.headers['x-aria-language'],
        country:    req.headers['x-aria-country'],
        currency:   req.headers['x-aria-currency'],
        segment:    req.headers['x-aria-segment'],
        appUrl:     req.headers['x-aria-app-url']
    })
}

export class AMPRSAConfiguration {
    algolia?: any
    url?: string
    cms?: any
    commerce?: any
    googlemaps?: any
}

export class ConfigLocator {
    hub: string
    environment: string
    constructor(configLocatorString: string) {
        [this.hub, this.environment] = configLocatorString.split(':')
    }
}

export async function fetchFromQueryContext(url: string, context: QueryContext) {
    return await context.fetch(url)
}

export default { QueryContext }