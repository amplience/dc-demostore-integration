import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup } from "./types"

export class Exception {
    exception: string
}

export type API = { }
export type CommerceAPI = API & {
    getProduct:         (args: GetCommerceObjectArgs)       => Promise<Product | Exception>
    getProducts:        (args: GetProductsArgs)             => Promise<Product[] | Exception>
    getCategory:        (args: GetCommerceObjectArgs)       => Promise<Category | Exception>
    getMegaMenu:        (args: CommonArgs)                  => Promise<Category[] | Exception>
    getCustomerGroups:  (args: CommonArgs)                  => Promise<CustomerGroup[] | Exception>
}