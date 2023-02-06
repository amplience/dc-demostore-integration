import { CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from '../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { SFCCProduct } from './sfcc/types';
/**
 * TODO
 */
declare type CodecConfig = {};
/**
 * TODO
 */
export declare class TemplateCommerceCodecType extends CommerceCodecType {
    /**
     * TODO
     */
    get vendor(): string;
    /**
     * TODO
     */
    get properties(): CodecConfig;
    /**
     * TODO
     * @param config
     * @returns
     */
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
/**
 * TODO
 */
export declare class TemplateCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    /**
     * TODO
     * @param codecType
     * @returns
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * TODO
     * @param args
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * TODO
     * @param args
     */
    getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default TemplateCommerceCodecType;
