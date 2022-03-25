import { AmplienceClient } from './amplience'
import { CodecConfiguration, getCodec } from './codec'
import CryptKeeper from './common/crypt-keeper'
import { DemoStoreConfiguration, Category, Product, QueryContext } from './types'

export * from './types'
export * from './codec'
export { CryptKeeper }

export class CommerceAPI {
    getProduct:     (args: QueryContext) => Promise<Product>
    getProducts:    (args: QueryContext) => Promise<Product[]>
    getCategory:    (args: QueryContext) => Promise<Category>
    getMegaMenu:    ()                   => Promise<Category[]>
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
    // return await getCodec(config.commerce)
}

// export const getCommerceAPIFromCodecConfig = async (codecConfig: CodecConfiguration): Promise<CommerceAPI> => {
//     return await getCodec(codecConfig)
// }