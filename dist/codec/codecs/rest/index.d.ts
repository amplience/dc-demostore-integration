import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, Product } from '../../../common';
import { Dictionary } from 'lodash';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core';
import { StringProperty } from '../../cms-property-types';
/**
 * REST Codec config properties.
 */
declare type CodecConfig = {
    productURL: StringProperty;
    categoryURL: StringProperty;
    customerGroupURL: StringProperty;
    translationsURL: StringProperty;
};
/**
 * Commerce Codec Type that integrates with REST.
 */
export declare class RestCommerceCodecType extends CommerceCodecType {
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
 * Commerce Codec that integrates with REST.
 */
export declare class RestCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    categories: Category[];
    products: Product[];
    customerGroups: CustomerGroup[];
    translations: Dictionary<Dictionary<string>>;
    /**
     * @inheritdoc
     */
    cacheMegaMenu(): Promise<void>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs, raw?: boolean): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default RestCommerceCodecType;
