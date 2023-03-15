import { Category, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product, Variant } from '../../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core';
import { StringProperty } from '../../../cms-property-types';
import { AxiosInstance } from 'axios';
/**
 * Shopify codec configuration.
 */
declare type CodecConfig = {
    access_token: StringProperty;
    version: StringProperty;
    site_id: StringProperty;
};
interface Edge<T> {
    node: T;
    cursor: string;
}
interface Paginated<T> {
    edges: Edge<T>[];
}
interface ShopifyCollectionMinimal {
    id: string;
    handle: string;
    title: string;
}
interface ShopifyPrice {
    currencyCode: string;
    amount: string;
}
interface ShopifyImage {
    id: string;
    url: string;
    altText: string;
}
interface ShopifyVariant {
    id: string;
    title: string;
    sku: string;
    selectedOptions: {
        name: string;
        value: string;
    }[];
    price: ShopifyPrice;
    unitPrice?: ShopifyPrice;
    compareAtPrice?: ShopifyPrice;
    image: ShopifyImage;
}
interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    collections: Paginated<ShopifyCollectionMinimal>;
    tags: string[];
    variants: Paginated<ShopifyVariant>;
    images: Paginated<ShopifyImage>;
    availableForSale: boolean;
}
/**
 * A template commerce codec type, useful as a starting point for a new integration.
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
 * A template commerce codec, useful as a starting point for a new integration.
 */
export declare class ShopifyCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    apiClient: AxiosInstance;
    /**
     * @inheritdoc
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    gqlRequest<T>(query: string, variables: any): Promise<T>;
    getProductById(id: string): Promise<ShopifyProduct>;
    getProductsByKeyword(keyword: string): Promise<ShopifyProduct[]>;
    getProductsByCategory(keyword: string): Promise<ShopifyProduct[]>;
    firstNonEmpty(strings: string[]): string;
    mapPrice(price: ShopifyPrice): string;
    mapCategoryMinimal(collection: ShopifyCollectionMinimal): Category;
    mapVariant(variant: ShopifyVariant, sharedImages: ShopifyImage[]): Variant;
    mapProduct(product: ShopifyProduct): Product;
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
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default ShopifyCommerceCodecType;
