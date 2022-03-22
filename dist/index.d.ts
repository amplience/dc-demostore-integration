import { CodecConfiguration } from './codec';
import { DemoStoreConfiguration, Category, Product, QueryContext } from './types';
declare const _default: {
    DemoStoreConfiguration: typeof DemoStoreConfiguration;
};
export default _default;
export * from './types';
export * from './codec';
export declare class CommerceAPI {
    getProduct: (args: QueryContext) => Promise<Product>;
    getProducts: (args: QueryContext) => Promise<Product[]>;
    getCategory: (args: QueryContext) => Promise<Category>;
    getMegaMenu: () => Promise<Category[]>;
}
export declare const getConfig: (configLocator: string) => Promise<DemoStoreConfiguration>;
export declare const getCommerceAPI: (configLocator: string) => Promise<CommerceAPI>;
export declare const getCommerceAPIFromCodecConfig: (codecConfig: CodecConfiguration) => Promise<CommerceAPI>;
