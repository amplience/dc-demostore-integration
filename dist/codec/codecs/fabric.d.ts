import { Product, Category, QueryContext } from '../../types';
import { CodecConfiguration, Codec } from '..';
import { CommerceAPI } from '../..';
export interface FabricCommerceCodecConfig extends CodecConfiguration {
    username: string;
    password: string;
    accountId: string;
}
export declare class FabricCommerceCodec extends Codec implements CommerceAPI {
    getProduct(context: QueryContext): Promise<Product>;
    getProducts(context: QueryContext): Promise<Product[]>;
    getCategory(context: QueryContext): Promise<Category>;
    getMegaMenu(): Promise<Category[]>;
}
declare const _default: {
    SchemaURI: string;
};
export default _default;
