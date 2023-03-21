import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup } from './types';
/**
 * Common exception type, with a string message.
 */
export declare class Exception {
    exception: string;
}
/**
 * Interface for a generic API.
 */
export declare type API = {};
/**
 * Interface for a Commerce API.
 */
export declare type CommerceAPI = API & {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getCategoryTree: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
    getRawProducts: (args: GetProductsArgs) => Promise<any[]>;
};
