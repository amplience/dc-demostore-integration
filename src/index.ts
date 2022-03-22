import { AmplienceClient } from './amplience'
import { CodecConfiguration, getCodec } from './codec'
import { AMPRSAConfiguration, Category, CategoryResults, Product, ProductResults, QueryContext } from './types'

export * from './types'
export * from './codec'

export class CommerceAPI {
    getProduct:     (args: QueryContext) => Promise<Product>
    getProducts:    (args: QueryContext) => Promise<Product[]>
    getCategory:    (args: QueryContext) => Promise<Category>
    getMegaMenu:    ()                   => Promise<Category[]>
}

export const getConfig = async (configLocator: string): Promise<AMPRSAConfiguration> => {
    return await new AmplienceClient(configLocator).getConfig()
}

export const getCommerceAPI = async (configLocator: string): Promise<CommerceAPI> => {
    return await getCodec((await getConfig(configLocator)).commerce)
}

export const getCommerceAPIFromCodecConfig = async (codecConfig: CodecConfiguration): Promise<CommerceAPI> => {
    return await getCodec(codecConfig)
}