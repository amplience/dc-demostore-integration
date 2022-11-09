import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthRestClientInterface, Product } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../';
import { StringProperty } from '../../cms-property-types';
declare type CodecConfig = ClientCredentialsConfiguration & {
    project: StringProperty;
    scope: StringProperty;
};
export declare class CommercetoolsCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class CommercetoolsCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    cacheMegaMenu(): Promise<void>;
    fetch(url: string): Promise<any>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default CommercetoolsCodecType;
