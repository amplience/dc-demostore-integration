import CryptKeeper from './common/crypt-keeper';
import OAuthRestClient from './common/rest-client';
import { flattenCategories } from './codec/codecs/common';
import { DemoStoreConfiguration, Category, Product, CustomerGroup, CommonArgs, GetCommerceObjectArgs, GetProductsArgs } from './types';
export * from './types';
export * from './codec';
export * from './common/paginator';
export { CryptKeeper };
export { OAuthRestClient };
export { flattenCategories };
import { SFCCCodecConfiguration } from './codec/codecs/sfcc';
export { SFCCCodecConfiguration };
export declare class API {
}
export declare class CommerceAPI extends API {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
}
export declare const getConfig: (configLocator: string) => Promise<DemoStoreConfiguration>;
export declare const getCommerceAPI: (configLocator: string) => Promise<CommerceAPI>;
export declare const getCommerceAPIFromConfig: (config: object) => Promise<CommerceAPI>;
