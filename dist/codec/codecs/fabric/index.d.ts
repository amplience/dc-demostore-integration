import { CommerceAPI, GetProductsArgs, OAuthCodecConfiguration, OAuthRestClientInterface, Product, UsernamePasswordConfiguration } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { StringProperty } from '../../cms-property-types';
declare type CodecConfig = OAuthCodecConfiguration & UsernamePasswordConfiguration & {
    accountId: StringProperty;
    accountKey: StringProperty;
    stage: StringProperty;
};
export declare class FabricCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class FabricCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    fetch(url: string): Promise<any>;
    cacheMegaMenu(): Promise<void>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
}
export default FabricCommerceCodecType;
