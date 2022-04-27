import { CodecConfiguration } from './codec';
import CryptKeeper from './common/crypt-keeper';
import OAuthRestClient from './common/rest-client';
import { flattenCategories } from './codec/codecs/common';
import middleware, { getCommerceAPI, getConfig } from './middleware/api';
import { isServer } from './util';
export * from './types';
export * from './codec';
export * from './common/paginator';
export { isServer, middleware, getCommerceAPI, getConfig, CryptKeeper, OAuthRestClient, flattenCategories };
import { GetCommerceObjectArgs, GetProductsArgs, CommonArgs, CustomerGroup, Product, Category } from './types';
export declare class API {
}
export declare class CommerceAPI extends API {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
}
export declare type Config = ConfigLocatorBlock | CodecConfiguration;
export declare type ConfigLocatorBlock = {
    config_locator: string;
};
