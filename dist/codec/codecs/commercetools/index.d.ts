import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthRestClientInterface, Product } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../';
import { StringProperty } from '../../cms-property-types';
/**
 * TODO
 */
declare type CodecConfig = ClientCredentialsConfiguration & {
    project: StringProperty;
    scope: StringProperty;
};
/**
 * TODO
 */
export declare class CommercetoolsCodecType extends CommerceCodecType {
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
export declare class CommercetoolsCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    /**
     * TODO
     * @param codecType
     * @returns
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * TODO
     */
    cacheMegaMenu(): Promise<void>;
    /**
     * TODO
     * @param url
     * @returns
     */
    fetch(url: string): Promise<any>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default CommercetoolsCodecType;
