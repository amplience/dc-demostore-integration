import { AmplienceClient } from './amplience'
import { CodecConfiguration, getCodec } from './codec'
import CryptKeeper from './common/crypt-keeper'
import OAuthRestClient from './common/rest-client'
import { flattenCategories } from './codec/codecs/common'
import { DemoStoreConfiguration, Category, Product, QueryContext, CustomerGroup } from './types'

export * from './types'
export * from './codec'
export * from './common/paginator'
export { CryptKeeper }
export { OAuthRestClient }
export { flattenCategories }

import { SFCCCodecConfiguration } from './codec/codecs/sfcc'
export { SFCCCodecConfiguration }

export class CommerceAPI {
    getProduct          : (args: QueryContext) => Promise<Product>
    getProducts         : (args: QueryContext) => Promise<Product[]>
    getCategory         : (args: QueryContext) => Promise<Category>
    getMegaMenu         : ()                   => Promise<Category[]>
    getCustomerGroups   : ()                   => Promise<CustomerGroup[]>
}

export const getConfig = async (configLocator: string): Promise<DemoStoreConfiguration> => {
    return await new AmplienceClient(configLocator).getConfig()
}

export const getCommerceAPI = async (configLocator: string): Promise<CommerceAPI> => {
    let demostoreConfig = await getConfig(configLocator)
    let config = await getCodec({ 
        ...demostoreConfig.commerce, 
        locator: demostoreConfig.locator
    })
    return config
}

export const getCommerceAPIFromConfig = async (config: object): Promise<CommerceAPI> => {
    let codec = await getCodec({ 
        ...config
    })
    return codec
}