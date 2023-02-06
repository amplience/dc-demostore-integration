import { Dictionary } from 'lodash';
/**
 * TODO
 */
export declare type Image = {
    url: string;
    thumb?: string;
};
/**
 * TODO
 */
export declare type Identifiable = {
    id: string;
    name: string;
};
/**
 * TODO
 */
export declare type CustomerGroup = Identifiable & {};
/**
 * TODO
 */
export declare type CommerceObject = Identifiable & {
    slug: string;
};
/**
 * TODO
 */
export declare type Product = CommerceObject & {
    shortDescription?: string;
    longDescription?: string;
    imageSetId?: string;
    categories: Category[];
    variants: Variant[];
};
/**
 * TODO
 */
export declare type Variant = {
    sku: string;
    listPrice: string;
    salePrice: string;
    defaultImage?: Image;
    images: Image[];
    attributes: Dictionary<string>;
};
/**
 * TODO
 */
export declare type Category = CommerceObject & {
    parent?: Category;
    image?: Image;
    children: Category[];
    products: Product[];
};
/**
 * TODO
 */
export declare type Promotion = Identifiable & {
    description: string;
    promoCode?: string;
    isActive: boolean;
    image?: Image;
};
/**
 * TODO
 */
export declare type GetAttributeArgs = {
    name: string;
};
/**
 * TODO
 */
export declare type CommonArgs = {
    locale?: string;
    language?: string;
    country?: string;
    currency?: string;
    segment?: string;
};
/**
 * TODO
 */
export declare type GetCommerceObjectArgs = CommonArgs & {
    id?: string;
    slug?: string;
};
/**
 * TODO
 */
export declare type GetVariantsArgs = CommonArgs & {
    productId: string;
};
/**
 * TODO
 */
export declare type GetProductsArgs = CommonArgs & {
    keyword?: string;
    productIds?: string;
    category?: Category;
};
/**
 * TODO
 */
export declare type AlgoliaConfig = {
    appId: string;
    apiKey: string;
};
/**
 * TODO
 */
export declare type AmplienceConfig = {
    hub: string;
    hubId: string;
    stagingApi: string;
    imageHub?: string;
};
/**
 * TODO
 */
export declare type DemoStoreConfiguration = {
    algolia: AlgoliaConfig;
    url?: string;
    cms: AmplienceConfig;
    commerce?: any;
};
