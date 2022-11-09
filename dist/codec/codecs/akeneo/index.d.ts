import { ClientCredentialsConfiguration, CommerceAPI, GetProductsArgs, OAuthRestClientInterface, Product, UsernamePasswordConfiguration } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
declare type CodecConfig = UsernamePasswordConfiguration & ClientCredentialsConfiguration;
export declare class AkeneoCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class AkeneoCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    cacheMegaMenu(): Promise<void>;
    fetch(url: string): Promise<any>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
}
export default AkeneoCommerceCodecType;
