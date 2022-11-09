import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, OAuthRestClientInterface, Product, CustomerGroup, GetVariantsArgs } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { StringProperty } from '../../cms-property-types';
import { SFCCProduct } from './types';
declare type CodecConfig = ClientCredentialsConfiguration & {
    api_token: StringProperty;
    site_id: StringProperty;
};
export declare class SFCCCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
    postProcess(config: CodecConfig): Promise<CodecConfig>;
}
export declare class SFCCCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    shopApi: string;
    sitesApi: string;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    cacheMegaMenu(): Promise<void>;
    fetch(url: string): Promise<any>;
    authenticatedFetch(url: string): Promise<any>;
    getProductById(productId: string): Promise<SFCCProduct>;
    search(query: string): Promise<SFCCProduct[]>;
    getVariants(args: GetVariantsArgs): Promise<SFCCProduct>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]>;
    getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]>;
}
export default SFCCCommerceCodecType;
