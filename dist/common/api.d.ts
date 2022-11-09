import { GetCommerceObjectArgs, Product, GetProductsArgs, GetProductVariantsArgs, Category, CommonArgs, CustomerGroup } from './types';
import { SFCCProduct } from '@/codec/codecs/sfcc/types';
export declare type API = {};
export declare type CommerceAPI = API & {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getVariants: (args: GetProductVariantsArgs) => Promise<SFCCProduct>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
};
