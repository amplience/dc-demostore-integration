import { CodecConfiguration } from './codec';
import { AMPRSAConfiguration, Category, Product, QueryContext } from './types';
export * from './types';
export * from './codec';
export declare class CommerceAPI {
    getProduct: (args: QueryContext) => Promise<Product>;
    getProducts: (args: QueryContext) => Promise<Product[]>;
    getCategory: (args: QueryContext) => Promise<Category>;
    getMegaMenu: () => Promise<Category[]>;
}
export declare const getConfig: (configLocator: string) => Promise<AMPRSAConfiguration>;
export declare const getCommerceAPI: (configLocator: string) => Promise<CommerceAPI>;
export declare const getCommerceAPIFromCodecConfig: (codecConfig: CodecConfiguration) => Promise<CommerceAPI>;
