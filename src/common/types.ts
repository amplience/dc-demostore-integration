import { Dictionary } from 'lodash'

export type Image = {
    url:                string
    thumb?:             string
}

export type Identifiable = {
    id:                 string
    name:               string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type CustomerGroup = Identifiable & {}

export type CommerceObject = Identifiable & {
    slug:               string
}

export type Product = CommerceObject & {
    shortDescription?:  string
    longDescription?:   string
    imageSetId?:        string
    categories:         Category[]
    variants:           Variant[]
}

export type Variant = {
    sku:                string
    listPrice:          string
    salePrice:          string
    defaultImage?:      Image
    images:             Image[]
    attributes:         Dictionary<string>
}

export type Category = CommerceObject & {
    parent?:            Category
    image?:             Image
    children:           Category[]
    products:           Product[]
}

export type Promotion = Identifiable & {
    description:        string
    promoCode?:         string
    isActive:           boolean
    image?:             Image
}

export type GetAttributeArgs = {
    name:               string
}

export type CommonArgs = {
    locale?:            string
    language?:          string
    country?:           string
    currency?:          string
    segment?:           string
}

export type GetCommerceObjectArgs = CommonArgs & {
    id?:                string
    slug?:              string
}

export type GetProductsArgs = CommonArgs & {
    keyword?:           string
    productIds?:        string
    category?:          Category
}

export type GetProductVariantsArgs = CommonArgs & {
    productId:           string
}

export type AlgoliaConfig = {
    appId:              string
    apiKey:             string
}

export type AmplienceConfig = {
    hub:                string
    stagingApi:         string
    imageHub?:          string
}

export type DemoStoreConfiguration = {
    algolia:            AlgoliaConfig
    url?:               string
    cms:                AmplienceConfig
    commerce?:          any
}