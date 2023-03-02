import { APIConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from "../../../common";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core';
import { StringProperty } from "../../cms-property-types";
declare type CodecConfig = APIConfiguration & {
    api_token: StringProperty;
    store_hash: StringProperty;
};
export declare class BigCommerceCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class BigCommerceCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    cacheMegaMenu(): Promise<void>;
    fetch(url: string): Promise<any>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default BigCommerceCommerceCodecType;
