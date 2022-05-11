import { CodecConfiguration } from './codec'
import CryptKeeper from './common/crypt-keeper'
import OAuthRestClient from './common/rest-client'
import { flattenCategories, getContentType, getContentTypeSchema } from './codec/codecs/common'
import middleware, { getCommerceAPI } from './middleware/api'
import { getDemoStoreConfig } from './amplience'
import { isServer, sleep } from './util'

export * from './types'
export * from './codec'
export * from './common/paginator'
export {
    isServer,
    middleware,
    getCommerceAPI,
    getDemoStoreConfig,

    // backwards compatibility
    getDemoStoreConfig as getConfig,

    CryptKeeper,
    OAuthRestClient,
    flattenCategories,
    getContentType,
    getContentTypeSchema,
    sleep
}

import { GetCommerceObjectArgs, GetProductsArgs, CommonArgs, CustomerGroup, Product, Category } from './types'

export class API { }
export class CommerceAPI extends API {
    getProduct:         (args: GetCommerceObjectArgs)   => Promise<Product>
    getProducts:        (args: GetProductsArgs)         => Promise<Product[]>
    getCategory:        (args: GetCommerceObjectArgs)   => Promise<Category>
    getMegaMenu:        (args: CommonArgs)              => Promise<Category[]>
    getCustomerGroups:  (args: CommonArgs)              => Promise<CustomerGroup[]>
}

export type Config = ConfigLocatorBlock | CodecConfiguration
export type ConfigLocatorBlock = {
    config_locator: string
}