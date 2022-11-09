import { CommerceAPI, GetProductsArgs, Product } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { StringProperty } from '../../cms-property-types';
declare type CodecConfig = {
    api_key: StringProperty;
    api_token: StringProperty;
};
export declare class ConstructorIOCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class ConstructorIOCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    fetch(url: string): Promise<any>;
    cacheMegaMenu(): Promise<void>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
}
export default ConstructorIOCommerceCodecType;
