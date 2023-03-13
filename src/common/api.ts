import {
	GetCommerceObjectArgs,
	Product,
	GetProductsArgs,
	Category,
	CommonArgs,
	CustomerGroup
} from './types'

/**
 * Common exception type, with a string message.
 */
export class Exception {
	exception: string
}

/**
 * Interface for a generic API.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type API = {}

/**
 * Interface for a Commerce API.
 */
export type CommerceAPI = API & {
	getProduct: (args: GetCommerceObjectArgs) => Promise<Product>
	getProducts: (args: GetProductsArgs) => Promise<Product[]>
	getCategory: (args: GetCommerceObjectArgs) => Promise<Category>
	getMegaMenu: (args: CommonArgs) => Promise<Category[]>
	getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>
	getRawProducts: (args: GetProductsArgs) => Promise<any[]>
}