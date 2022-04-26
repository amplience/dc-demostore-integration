import { CodecConfiguration } from './codec';
import CryptKeeper from './common/crypt-keeper';
import OAuthRestClient from './common/rest-client';
import { flattenCategories } from './codec/codecs/common';
import middleware, { getResponse } from './middleware/api';
import { isServer } from './util';
export * from './types';
export * from './codec';
export * from './common/paginator';
export { isServer, middleware, getResponse, CryptKeeper, OAuthRestClient, flattenCategories };
import { SFCCCodecConfiguration } from './codec/codecs/sfcc';
import { GetCommerceObjectArgs, GetProductsArgs, CommonArgs, CustomerGroup, DemoStoreConfiguration, Product, Category } from './types';
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
export declare type ConfigLocatorBlock = {
    config_locator: string;
};
export declare const getCommerceAPI: (config: string | ConfigLocatorBlock | CodecConfiguration) => Promise<CommerceAPI>;
export declare const getCommerceAPIFromConfig: (config: object) => Promise<CommerceAPI>;
