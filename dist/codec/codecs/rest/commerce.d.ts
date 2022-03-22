import { Product, Category, QueryContext } from '@/types';
import { CommerceCodec, CodecConfiguration } from '@/codec/codec';
import { CodecType } from '@/codec/codec-manager';
import { Dictionary } from 'lodash';
export interface RestCommerceCodecConfig extends CodecConfiguration {
    productURL: string;
    categoryURL: string;
    translationsURL: string;
}
export declare class RestCommerceCodec extends CommerceCodec {
    categories: Category[];
    products: Product[];
    translations: Dictionary<Dictionary<string>>;
    start(): Promise<void>;
    translatePrice: (price: string, context: QueryContext) => string;
    mapProduct: (context: QueryContext) => (product: Product) => Product;
    mapCategory: (context: QueryContext, depth?: number) => (category?: Category) => Category;
    getProduct(context: QueryContext): Promise<Product>;
    getProducts(context: QueryContext): Promise<{
        meta: {
            limit: any;
            count: any;
            offset: any;
            total: any;
        };
        results: any;
    }>;
    getCategory(context: QueryContext): Promise<Category>;
}
declare const type: CodecType;
export default type;
