import { SFCCProduct } from '@/codec/codecs/sfcc/types';
import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup, GetVariantsArgs } from './types';
/**
 * TODO
 */
export declare class Exception {
    exception: string;
}
/**
 * TODO
 */
export declare type API = {};
/**
 * TODO
 */
export declare type CommerceAPI = API & {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
    getVariants: (args: GetVariantsArgs) => Promise<SFCCProduct>;
    getRawProducts: (args: GetProductsArgs) => Promise<SFCCProduct[]>;
};
