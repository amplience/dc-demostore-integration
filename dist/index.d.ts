import CryptKeeper from './common/crypt-keeper';
import { DemoStoreConfiguration, Category, Product, QueryContext } from './types';
export * from './types';
export * from './codec';
export { CryptKeeper };
export declare class CommerceAPI {
    getProduct: (args: QueryContext) => Promise<Product>;
    getProducts: (args: QueryContext) => Promise<Product[]>;
    getCategory: (args: QueryContext) => Promise<Category>;
    getMegaMenu: () => Promise<Category[]>;
}
export declare const getConfig: (configLocator: string) => Promise<DemoStoreConfiguration>;
export declare const getCommerceAPI: (configLocator: string) => Promise<CommerceAPI>;
