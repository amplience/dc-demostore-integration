import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthRestClientInterface, Product } from "../../../common";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import { SFCCProduct } from "./types";
declare type CodecConfig = ClientCredentialsConfiguration & {
    api_token: StringProperty;
    site_id: StringProperty;
};
export declare class SFCCCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
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
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default SFCCCommerceCodecType;
