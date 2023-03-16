import { CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Product } from '../../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core';
import { StringProperty } from '../../../cms-property-types';
import { AxiosInstance } from 'axios';
import { ShopifyProduct } from './types';
/**
 * Shopify codec configuration.
 */
declare type CodecConfig = {
    access_token: StringProperty;
    version: StringProperty;
    site_id: StringProperty;
};
/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
export declare class ShopifyCommerceCodecType extends CommerceCodecType {
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
 * A template commerce codec, useful as a starting point for a new integration.
 */
export declare class ShopifyCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    apiClient: AxiosInstance;
    /**
     * @inheritdoc
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * TODO
     * @param query
     * @param variables
     * @returns
     */
    gqlRequest<T>(query: string, variables: any): Promise<T>;
    /**
     * TODO
     * @param id
     * @returns
     */
    getProductById(id: string): Promise<ShopifyProduct>;
    /**
     * TODO
     * @param keyword
     * @returns
     */
    getProductsByKeyword(keyword: string): Promise<ShopifyProduct[]>;
    /**
     * TODO
     * @param keyword
     * @returns
     */
    getProductsByCategory(keyword: string): Promise<ShopifyProduct[]>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs): Promise<ShopifyProduct[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]>;
}
export default ShopifyCommerceCodecType;
