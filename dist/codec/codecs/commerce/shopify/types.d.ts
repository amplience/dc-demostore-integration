/**
 * GraphQL response.
 */
export interface GqlResponse<T> {
    data: T;
}
/**
 * GraphQL edge from a paginated request.
 */
export interface Edge<T> {
    node: T;
    cursor: string;
}
/**
 * GraphQL pagination info.
 */
export interface PageInfo {
    hasNextPage: boolean;
    endCursor: string;
}
/**
 * GraphQL paginated request with edges.
 */
export interface Paginated<T> {
    edges: Edge<T>[];
    pageInfo: PageInfo;
}
/**
 * Shopify collection type.
 */
export interface ShopifyCollection {
    id: string;
    handle: string;
    title: string;
    image: ShopifyImage;
}
/**
 * Shopify price type.
 */
export interface ShopifyPrice {
    currencyCode: string;
    amount: string;
}
/**
 * Shopify image type.
 */
export interface ShopifyImage {
    id: string;
    url: string;
    altText: string;
}
/**
 * Shopify variant type.
 */
export interface ShopifyVariant {
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
/**
 * Shopify product type.
 */
export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    collections: Paginated<ShopifyCollection>;
    tags: string[];
    variants: Paginated<ShopifyVariant>;
    images: Paginated<ShopifyImage>;
    availableForSale: boolean;
}
/**
 * Shopify get products by query response.
 */
export interface ShopifyProductsByQuery {
    products: Paginated<ShopifyProduct>;
}
/**
 * Shopify get product by ID response.
 */
export interface ShopifyProductByID {
    product: ShopifyProduct;
}
/**
 * Shopify get products by collection response.
 */
export interface ShopifyProductsByCollection {
    collection: {
        products: Paginated<ShopifyProduct>;
    };
}
/**
 * Shopify get collections response.
 */
export interface ShopifyCollections {
    collections: Paginated<ShopifyCollection>;
}
/**
 * Shopify user segment.
 */
export interface ShopifySegment {
    id: string;
    name: string;
}
/**
 * Shopify get segments response.
 */
export interface ShopifySegments {
    segments: Paginated<ShopifySegment>;
}
