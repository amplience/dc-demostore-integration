import { AmplienceClient } from './amplience'
import { CodecConfiguration, getCodec } from './codec'
import { DemoStoreConfiguration, Category, Product, QueryContext } from './types'

export default { DemoStoreConfiguration }

export * from './types'
export * from './codec'

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
    return await getCodec((await getConfig(configLocator)).commerce)
}

export const getCommerceAPIFromCodecConfig = async (codecConfig: CodecConfiguration): Promise<CommerceAPI> => {
    return await getCodec(codecConfig)
}