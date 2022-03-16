import _ from 'lodash'

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
}

export class AMPRSAConfiguration {
    algolia?: any
    url?: string
    cms?: any
    commerce?: any
}

export default { QueryContext }