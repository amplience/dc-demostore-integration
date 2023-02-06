import { Dictionary } from 'lodash'

/**
 * TODO
 */
export type Image = {
    url:                string
    thumb?:             string
}

/**
 * TODO
 */
export type Identifiable = {
    id:                 string
    name:               string
}

/**
 * TODO
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type CustomerGroup = Identifiable & {}

/**
 * TODO
 */
export type CommerceObject = Identifiable & {
    slug:               string
}

/**
 * TODO
 */
export type Product = CommerceObject & {
    shortDescription?:  string
    longDescription?:   string
    imageSetId?:        string
    categories:         Category[]
    variants:           Variant[]
}

/**
 * TODO
 */
export type Variant = {
    sku:                string
    listPrice:          string
    salePrice:          string
    defaultImage?:      Image
    images:             Image[]
    attributes:         Dictionary<string>
}

/**
 * TODO
 */
export type Category = CommerceObject & {
    parent?:            Category
    image?:             Image
    children:           Category[]
    products:           Product[]
}

/**
 * TODO
 */
export type Promotion = Identifiable & {
    description:        string
    promoCode?:         string
    isActive:           boolean
    image?:             Image
}

/**
 * TODO
 */
export type GetAttributeArgs = {
    name:               string
}

/**
 * TODO
 */
export type CommonArgs = {
    locale?:            string
    language?:          string
    country?:           string
    currency?:          string
    segment?:           string
}

/**
 * TODO
 */
export type GetCommerceObjectArgs = CommonArgs & {
    id?:                string
    slug?:              string
}

/**
 * TODO
 */
export type GetVariantsArgs = CommonArgs & {
    productId:        string
}

/**
 * TODO
 */
export type GetProductsArgs = CommonArgs & {
    keyword?:           string
    productIds?:        string
    category?:          Category
}

/**
 * TODO
 */
export type AlgoliaConfig = {
    appId:              string
    apiKey:             string
}

/**
 * TODO
 */
export type AmplienceConfig = {
    hub:                string
    hubId:              string
    stagingApi:         string
    imageHub?:          string
}

/**
 * TODO
 */
export type DemoStoreConfiguration = {
    algolia:            AlgoliaConfig
    url?:               string
    cms:                AmplienceConfig
    commerce?:          any
}