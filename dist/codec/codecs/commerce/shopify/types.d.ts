export interface GqlResponse<T> {
    data: T;
}
export interface Edge<T> {
    node: T;
    cursor: string;
}
export interface Paginated<T> {
    edges: Edge<T>[];
}
export interface ShopifyCollectionMinimal {
    id: string;
    handle: string;
    title: string;
}
export interface ShopifyPrice {
    currencyCode: string;
    amount: string;
}
export interface ShopifyImage {
    id: string;
    url: string;
    altText: string;
}
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
export interface ShopifyProduct {
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
export interface ShopifyProductsByQuery {
    products: Paginated<ShopifyProduct>;
}
export interface ShopifyProductByID {
    product: ShopifyProduct;
}
export interface ShopifyProductsByCategory {
    category: {
        products: Paginated<ShopifyProduct>;
    };
}
export interface ShopifySegment {
    id: string;
    name: string;
    query: string;
}
export interface ShopifySegments {
    segments: Paginated<ShopifySegment>;
}
