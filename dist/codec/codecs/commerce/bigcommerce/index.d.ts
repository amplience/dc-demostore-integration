import { APIConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from '../../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core';
import { StringProperty } from '../../../cms-property-types';
import { BigCommerceProduct } from './types';
/**
 * BigCommerce Codec config properties
 */
declare type CodecConfig = APIConfiguration & {
    api_token: StringProperty;
    store_hash: StringProperty;
};
/**
 * Commerce Codec Type that integrates with BigCommerce.
 */
export declare class BigCommerceCommerceCodecType extends CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor(): string;
    /**
     * @inheritdoc
     */
    get properties(): CodecConfig;
    /**
     * @inheritdoc
     */
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
/**
 * ommerce Codec that integrates with BigCommerce.
 */
export declare class BigCommerceCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    /**
     * @inheritdoc
     */
    cacheMegaMenu(): Promise<void>;
    /**
     * Fetches data using store hash and API token.
     * @param url URL to fetch data from
     * @returns Response data
     */
    fetch(url: string): Promise<any>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs, method?: string): Promise<BigCommerceProduct[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default BigCommerceCommerceCodecType;
