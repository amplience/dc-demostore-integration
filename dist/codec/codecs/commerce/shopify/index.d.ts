import { CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Product } from '../../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core';
import { StringProperty } from '../../../cms-property-types';
import { AxiosInstance } from 'axios';
import { GqlError, Paginated, ShopifyProduct } from './types';
import { GetPageResultCursor } from '../../pagination';
/**
 * Shopify codec configuration.
 */
declare type CodecConfig = {
    /** Storefront access token */
    access_token: StringProperty;
    /** Admin access token */
    admin_access_token: StringProperty;
    /** API version */
    version: StringProperty;
    /** Site identifier */
    site_id: StringProperty;
};
/**
 * Commerce Codec Type that integrates with Shopify.
 */
export declare class ShopifyCommerceCodecType extends CommerceCodecType {
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
 * Commerce Codec that integrates with Shopify.
 */
export declare class ShopifyCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    apiClient: AxiosInstance;
    adminApiClient: AxiosInstance;
    /**
     * @inheritdoc
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * Converts GraphQL errors to CodecError info.
     * @param errors GraphQL errors
     * @returns CodecError info
     */
    fromGqlErrors(errors: GqlError[]): {
        message: string;
        errors: GqlError[];
    };
    /**
     * Make a request to the shopify GraphQL API.
     * @param query The GraphQL query string
     * @param variables Variables to use with the GraphQL query
     * @param isAdmin Whether the admin credentials must be used or not
     * @returns GraphQL response data
     */
    gqlRequest<T>(query: string, variables: any, isAdmin?: boolean): Promise<T>;
    /**
     * Generate a function that gets a page from the shopify GraphQL API.
     * @param query The GraphQL query string
     * @param variables Variables to use with the GraphQL query
     * @param getPaginated Function that gets the Paginated<T2> type from the request type T
     * @param isAdmin Whether the admin credentials must be used or not
     * @returns A function that gets a page from a cursor and pageSize.
     */
    getPageGql<T, T2>(query: string, variables: any, getPaginated: (response: T) => Paginated<T2>, isAdmin?: boolean): (cursor: string | undefined, pageSize: number) => Promise<GetPageResultCursor<T2>>;
    /**
     * @inheritdoc
     */
    cacheCategoryTree(): Promise<void>;
    /**
     * Get a shopify product by ID.
     * @param id The ID of the product to fetch
     * @returns The shopify product
     */
    getProductById(id: string): Promise<ShopifyProduct>;
    /**
     * Get a list of all shopify products that match the given keyword.
     * @param keyword Keyword used to search products
     * @returns A list of all matching products
     */
    getProductsByKeyword(keyword: string): Promise<ShopifyProduct[]>;
    /**
     * Get a list of all shopify products in the category with the given slug.
     * @param slug The category slug
     * @returns A list of all products in the category
     */
    getProductsByCategory(slug: string): Promise<ShopifyProduct[]>;
    /**
     * @inheritdoc
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * @inheritdoc
     */
    getRawProducts(args: GetProductsArgs): Promise<ShopifyProduct[]>;
    /**
     * @inheritdoc
     */
    getCustomerGroups(args: CommonArgs): Promise<CustomerGroup[]>;
}
export default ShopifyCommerceCodecType;
