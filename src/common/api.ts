import { SFCCProduct } from '@/codec/codecs/sfcc/types'
import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup, GetVariantsArgs } from './types'

export class Exception {
	exception: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type API = { }
export type CommerceAPI = API & {
    getProduct:         (args: GetCommerceObjectArgs)       => Promise<Product>
    getProducts:        (args: GetProductsArgs)             => Promise<Product[]>
    getCategory:        (args: GetCommerceObjectArgs)       => Promise<Category>
    getMegaMenu:        (args: CommonArgs)                  => Promise<Category[]>
    getCustomerGroups:  (args: CommonArgs)                  => Promise<CustomerGroup[]>
    getVariants:        (args: GetVariantsArgs)             => Promise<SFCCProduct>
}