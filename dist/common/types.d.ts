import { Dictionary } from 'lodash';
/**
 * Simple image type with an URL and thumbnail URL.
 */
export declare type Image = {
    url: string;
    thumb?: string;
};
/**
 * Base resource type with identifiable ID and Name.
 */
export declare type Identifiable = {
    id: string;
    name: string;
};
/**
 * Customer Group
 */
export declare type CustomerGroup = Identifiable & {};
/**
 * Commerce Object with a slug
 */
export declare type CommerceObject = Identifiable & {
    slug: string;
};
/**
 * Product with descriptions, images, categories and variants.
 */
export declare type Product = CommerceObject & {
    shortDescription?: string;
    longDescription?: string;
    imageSetId?: string;
    categories: Category[];
    variants: Variant[];
};
/**
 * Variant identified by SKU, with price, images and attributes.
 */
export declare type Variant = {
    id: string;
    sku: string;
    listPrice: string;
    salePrice: string;
    defaultImage?: Image;
    images: Image[];
    attributes: Dictionary<string>;
};
/**
 * Category with images, products, children and a parent.
 */
export declare type Category = CommerceObject & {
    parent?: Category;
    image?: Image;
    children: Category[];
    products: Product[];
};
/**
 * Promotion with description, code, an image and activity status.
 */
export declare type Promotion = Identifiable & {
    description: string;
    promoCode?: string;
    isActive: boolean;
    image?: Image;
};
/**
 * Get Attribute method arguments.
 */
export declare type GetAttributeArgs = {
    name: string;
};
/**
 * Common method arguments.
 */
export declare type CommonArgs = {
    locale?: string;
    language?: string;
    country?: string;
    currency?: string;
    segment?: string;
};
/**
 * Common method arguments for fetching a commerce object.
 */
export declare type GetCommerceObjectArgs = CommonArgs & {
    id?: string;
    slug?: string;
};
/**
 * Method arguments for fetching products.
 */
export declare type GetProductsArgs = CommonArgs & {
    keyword?: string;
    productIds?: string;
    category?: Category;
};
/**
 * Algolia configuration properties.
 */
export declare type AlgoliaConfig = {
    appId: string;
    apiKey: string;
};
/**
 * Amplience configuration properties.
 */
export declare type AmplienceConfig = {
    hub: string;
    hubId: string;
    stagingApi: string;
    imageHub?: string;
};
/**
 * Demostore configuration properties.
 */
export declare type DemoStoreConfiguration = {
    algolia: AlgoliaConfig;
    url?: string;
    cms: AmplienceConfig;
    commerce?: any;
};
