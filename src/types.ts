import { Method } from 'axios'
import _, { Dictionary } from 'lodash'

export class ProductImage {
    url: string
    large?: string
    thumb?: string
}

export class Identifiable {
    id: string
    name: string
}

export class CommerceObject extends Identifiable {
    slug: string
}

export class Product extends CommerceObject {
    shortDescription?: string
    longDescription?: string
    imageSetId?: string
    categories: Category[]
    variants: Variant[]
    productType?: string
}

export class Variant {
    sku: string
    listPrice: string
    salePrice: string
    defaultImage?: ProductImage
    images: ProductImage[]
    attributes: Dictionary<string>
}

export class Category extends CommerceObject {
    parent?: Category
    children: Category[]
    products: Product[]
}

export class GetCategoryArgs {
    id?: string
    slug?: string
}

export class GetCategoryProductArgs {
    full?: boolean
    segment?: string
}

export class GetProductsArgs {
    keyword?: string
    segment?: string
    productIds?: string
}

export class GetProductArgs {
    id?: string
    sku?: string
    slug?: string
    segment?: string
}

export class GetAttributeArgs {
    name: string
}

export interface QueryContext {
    args: any
    locale: string
    language: string
    country: string
    currency: string
    segment: string
    appUrl: string
    method: Method
}

export const qc = (args: any,
    locale: string = 'en-US',
    language: string = 'en',
    country: string = 'US',
    currency: string = 'USD',
    segment: string = '',
    appUrl: string = '',
    method: Method = 'get',
): QueryContext => ({
    ...args,
    locale,
    language,
    country,
    currency,
    segment,
    appUrl,
    method
})

export class DemoStoreConfiguration {
    algolia?: any
    url?: string
    cms?: any
    commerce?: any
    locator: string
}