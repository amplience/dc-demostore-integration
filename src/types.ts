import _, { Dictionary } from 'lodash'
import { CodecConfiguration } from './codec'

export interface Image {
    url: string
    thumb?: string
}

export interface Identifiable {
    id: string
    name: string
}

export interface CustomerGroup extends Identifiable {}

export interface CommerceObject extends Identifiable {
    slug: string
}

export interface Product extends CommerceObject {
    shortDescription?: string
    longDescription?: string
    imageSetId?: string
    categories: Category[]
    variants: Variant[]
}

export interface Variant {
    sku: string
    listPrice: string
    salePrice: string
    defaultImage?: Image
    images: Image[]
    attributes: Dictionary<string>
}

export interface Category extends CommerceObject {
    parent?: Category
    image?: Image
    children: Category[]
    products: Product[]
}

export interface Promotion extends Identifiable {
    description: string
    promoCode?: string
    isActive: boolean
    image?: Image
}

export interface GetAttributeArgs {
    name: string
}

export interface CommonArgs {
    [key: string]: any;
    locale?: string
    language?: string
    country?: string
    currency?: string
    segment?: string
}

export interface GetCommerceObjectArgs extends CommonArgs {
    id?: string
    slug?: string
}

export interface GetProductsArgs extends CommonArgs {
    keyword?: string
    productIds?: string
}

export interface AlgoliaConfig {
    appId: string
    apiKey: string
}

export interface AmplienceConfig {
    hub: string
    stagingApi: string
    imageHub?: string
}

export interface DemoStoreConfiguration {
    algolia: AlgoliaConfig
    url?: string
    cms: AmplienceConfig
    commerce?: CodecConfiguration
}