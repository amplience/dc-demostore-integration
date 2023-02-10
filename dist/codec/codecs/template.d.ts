import { CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from '../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { SFCCProduct } from './sfcc/types';
/**
 * Common codec configuration.
 */
declare type CodecConfig = {};
/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
export declare class TemplateCommerceCodecType extends CommerceCodecType {
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
export declare class TemplateCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    /**
     * @inheritdoc
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default TemplateCommerceCodecType;
