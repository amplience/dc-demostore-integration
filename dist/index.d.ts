import CryptKeeper from './common/crypt-keeper';
import OAuthRestClient from './common/rest-client';
import { flattenCategories } from './codec/codecs/common';
import { DemoStoreConfiguration, Category, Product, QueryContext, CustomerGroup } from './types';
export * from './types';
export * from './codec';
export * from './common/paginator';
export { CryptKeeper };
export { OAuthRestClient };
export { flattenCategories };
import { SFCCCodecConfiguration } from './codec/codecs/sfcc';
export { SFCCCodecConfiguration };
export declare class CommerceAPI {
    getProduct: (args: QueryContext) => Promise<Product>;
    getProducts: (args: QueryContext) => Promise<Product[]>;
    getCategory: (args: QueryContext) => Promise<Category>;
    getMegaMenu: () => Promise<Category[]>;
    getCustomerGroups: () => Promise<CustomerGroup[]>;
}
export declare const getConfig: (configLocator: string) => Promise<DemoStoreConfiguration>;
export declare const getCommerceAPI: (configLocator: string) => Promise<CommerceAPI>;
export declare const getCommerceAPIFromConfig: (config: object) => Promise<CommerceAPI>;
