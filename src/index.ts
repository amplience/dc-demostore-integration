import { codecManager } from './codec/codec-manager'
import { Category, CategoryResults, Product, ProductResults, QueryContext } from './types'

export * from './types'
export * from './codec/codec'
export * from './codec/codec-manager'
export * from './operation'

export interface CommerceInterface {
    getProduct:     (args: QueryContext) => Promise<Product>
    getProducts:    (args: QueryContext) => Promise<ProductResults>
    getCategory:    (args: QueryContext) => Promise<Category>
    getCategories:  (args: QueryContext) => Promise<CategoryResults>
}

export const CommerceAPI = async (configLocator: string): Promise<CommerceInterface> => {
    let configCodec = await (await codecManager.getConfigCodec(configLocator)).getConfig()
    return await codecManager.getCommerceCodec(configCodec.commerce)
}