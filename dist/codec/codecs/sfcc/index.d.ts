import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, OAuthRestClientInterface, Product, CustomerGroup, GetVariantsArgs } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { StringProperty } from '../../cms-property-types';
import { AxiosRequestConfig } from 'axios';
import { SFCCProduct } from './types';
/**
 * TODO
 */
declare type CodecConfig = ClientCredentialsConfiguration & {
    api_token: StringProperty;
    site_id: StringProperty;
    version?: StringProperty;
};
/**
 * TODO
 */
export declare class SFCCCommerceCodecType extends CommerceCodecType {
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
    /**
     * TODO
     * @param config
     * @returns
     */
    postProcess(config: CodecConfig): Promise<CodecConfig>;
}
/**
 * TODO
 */
export declare class SFCCCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    shopApi: string;
    sitesApi: string;
    getPage: <T>(client: OAuthRestClientInterface, url: string, params?: any) => (page: number, pageSize: number) => Promise<{
        data: T[];
        total: number;
    }>;
    getPageAxios: <T>(axios: import("axios").AxiosStatic, url: string, config: AxiosRequestConfig<any>, params?: any, dataMutator?: (data: any) => T[]) => (page: number, pageSize: number) => Promise<{
        data: T[];
        total: number;
    }>;
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
     * Gets the request config based off of the configuration parameters
     * @returns Axios request config
     */
    axiosConfig(): AxiosRequestConfig;
    /**
     * TODO
     * @param url
     * @returns
     */
    fetch(url: string): Promise<any>;
    /**
     * TODO
     * @param url
     * @returns
     */
    authenticatedFetch(url: string): Promise<any>;
    /**
     * TODO
     * @param productId
     * @returns
     */
    getProductById(productId: string): Promise<SFCCProduct>;
    /**
     * TODO
     * @param query
     * @returns
     */
    search(query: string): Promise<SFCCProduct[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getVariants(args: GetVariantsArgs): Promise<SFCCProduct>;
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
    getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]>;
}
export default SFCCCommerceCodecType;
