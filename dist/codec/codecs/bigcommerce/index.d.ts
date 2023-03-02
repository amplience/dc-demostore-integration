import { APIConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from "../../../common";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core';
import { StringProperty } from "../../cms-property-types";
import { BigCommerceProduct } from "./types";
/**
 * TODO
 */
declare type CodecConfig = APIConfiguration & {
    api_token: StringProperty;
    store_hash: StringProperty;
};
/**
 * TODO
 */
export declare class BigCommerceCommerceCodecType extends CommerceCodecType {
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
export declare class BigCommerceCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
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
    getRawProducts(args: GetProductsArgs, method?: string): Promise<BigCommerceProduct[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default BigCommerceCommerceCodecType;
