import { AmplienceClient } from './amplience'
import { CodecConfiguration, getCodec } from './codec'
import CryptKeeper from './common/crypt-keeper'
import OAuthRestClient from './common/rest-client'
import { flattenCategories } from './codec/codecs/common'
import middleware, { getResponse } from './middleware/api'
import { isServer } from './util'

export * from './types'
export * from './codec'
export * from './common/paginator'
export {
    isServer,
    middleware,
    getResponse,
    CryptKeeper,
    OAuthRestClient,
    flattenCategories
}

import { SFCCCodecConfiguration } from './codec/codecs/sfcc'
import { GetCommerceObjectArgs, GetProductsArgs, CommonArgs, CustomerGroup, DemoStoreConfiguration, Product, Category } from './types'
export { SFCCCodecConfiguration }

export class API { }
export class CommerceAPI extends API {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>
    getProducts: (args: GetProductsArgs) => Promise<Product[]>
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>
}

export const getConfig = async (configLocator: string): Promise<DemoStoreConfiguration> => {
    return await new AmplienceClient(configLocator).getConfig()
}

export type ConfigLocatorBlock = {
    config_locator: string
}

export const getCommerceAPI = async (config: string | ConfigLocatorBlock | CodecConfiguration): Promise<CommerceAPI> => {
    if (typeof config === 'string') {
        let demostoreConfig = await getConfig(config)
        return await getCommerceAPIFromConfig(demostoreConfig.commerce)
    }
    else {
        if ('config_locator' in config && config.config_locator) {
            let demostoreConfig = await getConfig(config.config_locator)
            return await getCommerceAPIFromConfig(demostoreConfig.commerce)
        }
        else if ('_meta' in config) {
            return await getCodec(config)
        }
    }
}

export const getCommerceAPIFromConfig = async (config: object): Promise<CommerceAPI> => {
    return await getCodec(config)
}