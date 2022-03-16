import { AmplienceClient } from './amplience'
import { codecManager } from './codec/codec-manager'
import { AMPRSAConfiguration, Category, CategoryResults, Product, ProductResults, QueryContext } from './types'

export * from './types'
export * from './codec/codec'
export * from './codec/codec-manager'
export * from './operation'

export interface CommerceAPI {
    getProduct:     (args: QueryContext) => Promise<Product>
    getProducts:    (args: QueryContext) => Promise<ProductResults>
    getCategory:    (args: QueryContext) => Promise<Category>
    getCategories:  (args: QueryContext) => Promise<CategoryResults>
}

export const getConfig = async (configLocator: string): Promise<AMPRSAConfiguration> => {
    return await new AmplienceClient(configLocator).getConfig()
}

export const getCommerceAPI = async (configLocator: string): Promise<CommerceAPI> => {
    return await codecManager.getCommerceCodec((await getConfig(configLocator)).commerce)
}