import { Product, Category, QueryContext, CategoryResults } from '../../types';
import { CodecConfiguration, Codec } from '..';
import { CommerceAPI } from '../..';
export interface RestCommerceCodecConfig extends CodecConfiguration {
    productURL: string;
    categoryURL: string;
    translationsURL: string;
}
declare class RestCommerceCodec extends Codec implements CommerceAPI {
    config: RestCommerceCodecConfig;
    start(): Promise<void>;
    filterCategoryId: (category: Category) => (product: Product) => boolean;
    translatePrice: (price: string, context: QueryContext) => string;
    mapProduct: (context: QueryContext) => (product: Product) => Product;
    mapCategory: (context: QueryContext, depth?: number) => (category: Category) => Category;
    getProduct(context: QueryContext): Promise<Product>;
    getProducts(context: QueryContext): Promise<Product[]>;
    getCategory(context: QueryContext): Promise<Category>;
    getMegaMenu(): Promise<Category[]>;
    getCategories(context: QueryContext): Promise<CategoryResults>;
}
declare const _default: {
    SchemaURI: string;
    getInstance: (config: RestCommerceCodecConfig) => Promise<RestCommerceCodec>;
};
export default _default;
