import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../types';
import { CodecConfiguration, Codec } from '..';
import { CommerceAPI } from '../..';
export interface FabricCommerceCodecConfig extends CodecConfiguration {
    username: string;
    password: string;
    accountId: string;
}
export declare class FabricCommerceCodec implements Codec, CommerceAPI {
    SchemaURI: string;
    getAPI(config: CodecConfiguration): any;
    canUseConfiguration(config: CodecConfiguration): boolean;
    getProduct(args: GetCommerceObjectArgs): Promise<Product>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCategory(args: GetCommerceObjectArgs): Promise<Category>;
    getMegaMenu(): Promise<Category[]>;
    getCustomerGroups(): Promise<CustomerGroup[]>;
}
declare const _default: {
    SchemaURI: string;
};
export default _default;
