import { SFCCProduct } from '@/codec/codecs/sfcc/types';
import { GetCommerceObjectArgs, Product, GetProductsArgs, Category, CommonArgs, CustomerGroup, GetVariantsArgs } from './types';
export declare class Exception {
    exception: string;
}
export declare type API = {};
export declare type CommerceAPI = API & {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
    getVariants: (args: GetVariantsArgs) => Promise<SFCCProduct>;
    getRawProducts: (args: GetProductsArgs) => Promise<SFCCProduct[]>;
};
