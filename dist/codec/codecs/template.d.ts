import { CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from '../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { SFCCProduct } from './sfcc/types';
declare type CodecConfig = {};
export declare class TemplateCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class TemplateCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default TemplateCommerceCodecType;
