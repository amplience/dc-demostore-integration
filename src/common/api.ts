import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup } from "./types"

export type API = { }
export type CommerceAPI = API & {
    getProduct:         (args: GetCommerceObjectArgs)   => Promise<Product>
    getProducts:        (args: GetProductsArgs)         => Promise<Product[]>
    getCategory:        (args: GetCommerceObjectArgs)   => Promise<Category>
    getMegaMenu:        (args: CommonArgs)              => Promise<Category[]>
    getCustomerGroups:  (args: CommonArgs)              => Promise<CustomerGroup[]>
}
