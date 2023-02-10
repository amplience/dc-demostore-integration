import { Dictionary } from 'lodash'

/**
 * Simple image type with an URL and thumbnail URL.
 */
export type Image = {
    url:                string
    thumb?:             string
}

/**
 * Base resource type with identifiable ID and Name.
 */
export type Identifiable = {
    id:                 string
    name:               string
}

/**
 * Customer Group
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type CustomerGroup = Identifiable & {}

/**
 * Commerce Object with a slug
 */
export type CommerceObject = Identifiable & {
    slug:               string
}

/**
 * Product with descriptions, images, categories and variants.
 */
export type Product = CommerceObject & {
    shortDescription?:  string
    longDescription?:   string
    imageSetId?:        string
    categories:         Category[]
    variants:           Variant[]
}

/**
 * Variant identified by SKU, with price, images and attributes.
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
 * Category with images, products, children and a parent.
 */
export type Category = CommerceObject & {
    parent?:            Category
    image?:             Image
    children:           Category[]
    products:           Product[]
}

/**
 * Promotion with description, code, an image and activity status.
 */
export type Promotion = Identifiable & {
    description:        string
    promoCode?:         string
    isActive:           boolean
    image?:             Image
}

/**
 * Get Attribute method arguments.
 */
export type GetAttributeArgs = {
    name:               string
}

/**
 * Common method arguments.
 */
export type CommonArgs = {
    locale?:            string
    language?:          string
    country?:           string
    currency?:          string
    segment?:           string
}

/**
 * Common method arguments for fetching a commerce object.
 */
export type GetCommerceObjectArgs = CommonArgs & {
    id?:                string
    slug?:              string
}

/**
 * Method arguments for fetching variants.
 */
export type GetVariantsArgs = CommonArgs & {
    productId:        string
}

/**
 * Method arguments for fetching products.
 */
export type GetProductsArgs = CommonArgs & {
    keyword?:           string
    productIds?:        string
    category?:          Category
}

/**
 * Algolia configuration properties.
 */
export type AlgoliaConfig = {
    appId:              string
    apiKey:             string
}

/**
 * Amplience configuration properties.
 */
export type AmplienceConfig = {
    hub:                string
    hubId:              string
    stagingApi:         string
    imageHub?:          string
}

/**
 * Demostore configuration properties.
 */
export type DemoStoreConfiguration = {
    algolia:            AlgoliaConfig
    url?:               string
    cms:                AmplienceConfig
    commerce?:          any
}