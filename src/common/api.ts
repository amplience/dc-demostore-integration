import { GetCommerceObjectArgs, Product, GetProductsArgs, GetProductVariantsArgs, Category, CommonArgs, CustomerGroup } from './types'
import { SFCCProduct } from '@/codec/codecs/sfcc/types'

// eslint-disable-next-line @typescript-eslint/ban-types
export type API = { }
export type CommerceAPI = API & {
    getProduct:         (args: GetCommerceObjectArgs)       => Promise<Product>
    getVariants:        (args: GetProductVariantsArgs)      => Promise<SFCCProduct>
    getProducts:        (args: GetProductsArgs)             => Promise<Product[]>
    getCategory:        (args: GetCommerceObjectArgs)       => Promise<Category>
    getMegaMenu:        (args: CommonArgs)                  => Promise<Category[]>
    getCustomerGroups:  (args: CommonArgs)                  => Promise<CustomerGroup[]>
}