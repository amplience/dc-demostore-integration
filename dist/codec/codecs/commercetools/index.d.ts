import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthRestClientInterface, Product } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core';
import { StringProperty } from '../../cms-property-types';
import { CTProduct } from './types';
/**
 * Commercetools Codec config properties
 */
declare type CodecConfig = ClientCredentialsConfiguration & {
    project: StringProperty;
    scope: StringProperty;
};
/**
 * Commerce Codec Type that integrates with Commercetools.
 */
export declare class CommercetoolsCodecType extends CommerceCodecType {
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
 * Commerce Codec that integrates with Commercetools.
 */
export declare class CommercetoolsCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    getPage: <T>(client: OAuthRestClientInterface, url: string, params?: any) => (page: number, pageSize: number) => Promise<{
        data: T[];
        total: number;
    }>;
    /**
     * @inheritdoc
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * @inheritdoc
     */
    cacheMegaMenu(): Promise<void>;
    /**
     * Fetches data from the OAuth authenticated client.
     * @param url URL to fetch data from
     * @returns Response data
     */
    fetch(url: string): Promise<any>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs, method?: string): Promise<CTProduct[]>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default CommercetoolsCodecType;
