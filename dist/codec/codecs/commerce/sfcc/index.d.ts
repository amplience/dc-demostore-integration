import { ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, OAuthRestClientInterface, Product, CustomerGroup } from '../../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core';
import { StringProperty } from '../../../cms-property-types';
import { AxiosRequestConfig } from 'axios';
import { SFCCProduct } from './types';
/**
 * SFCC Codec config properties.
 */
declare type CodecConfig = ClientCredentialsConfiguration & {
    api_token: StringProperty;
    site_id: StringProperty;
    version?: StringProperty;
};
/**
 * Commerce Codec Type that integrates with SFCC.
 */
export declare class SFCCCommerceCodecType extends CommerceCodecType {
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
    /**
     * @inheritdoc
     */
    postProcess(config: CodecConfig): Promise<CodecConfig>;
}
/**
 * Commerce Codec that integrates with SFCC.
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
    getPageAxios: <T>(axios: import("axios").AxiosStatic, url: string, config: AxiosRequestConfig<any>, params?: any) => (page: number, pageSize: number) => Promise<{
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
    cacheCategoryTree(): Promise<void>;
    /**
     * Gets the request config based off of the configuration parameters
     * @returns Axios request config
     */
    axiosConfig(): AxiosRequestConfig;
    /**
     * Fetches data from the unauthenticated axios client.
     * @param url URL to fetch data from
     * @returns Response data
     */
    fetch(url: string): Promise<any>;
    /**
     * Fetches data from the OAuth authenticated client.
     * @param url URL to fetch data from
     * @returns Response data
     */
    authenticatedFetch(url: string): Promise<any>;
    /**
     * Gets an SFCC product by ID.
     * @param productId Product ID to fetch
     * @returns SFCC product
     */
    getProductById(productId: string): Promise<SFCCProduct | null>;
    /**
     * Lists SFCC products for a given search query.
     * @param query Search query
     * @returns List of SFCC products
     */
    search(query: string): Promise<SFCCProduct[]>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs, method?: string): Promise<SFCCProduct[]>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]>;
}
export default SFCCCommerceCodecType;
