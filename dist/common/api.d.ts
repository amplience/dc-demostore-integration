import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup } from "./types";
export declare class Exception {
    exception: string;
}
export declare type API = {};
export declare type CommerceAPI = API & {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product | Exception>;
    getProducts: (args: GetProductsArgs) => Promise<Product[] | Exception>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category | Exception>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[] | Exception>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[] | Exception>;
};
