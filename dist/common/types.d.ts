import { Dictionary } from 'lodash';
export declare type Image = {
    url: string;
    thumb?: string;
};
export declare type Identifiable = {
    id: string;
    name: string;
};
export declare type CustomerGroup = Identifiable & {};
export declare type CommerceObject = Identifiable & {
    slug: string;
};
export declare type Product = CommerceObject & {
    shortDescription?: string;
    longDescription?: string;
    imageSetId?: string;
    categories: Category[];
    variants: Variant[];
};
export declare type Variant = {
    sku: string;
    listPrice: string;
    salePrice: string;
    defaultImage?: Image;
    images: Image[];
    attributes: Dictionary<string>;
};
export declare type Category = CommerceObject & {
    parent?: Category;
    image?: Image;
    children: Category[];
    products: Product[];
};
export declare type Promotion = Identifiable & {
    description: string;
    promoCode?: string;
    isActive: boolean;
    image?: Image;
};
export declare type GetAttributeArgs = {
    name: string;
};
export declare type CommonArgs = {
    locale?: string;
    language?: string;
    country?: string;
    currency?: string;
    segment?: string;
};
export declare type GetCommerceObjectArgs = CommonArgs & {
    id?: string;
    slug?: string;
};
export declare type GetVariantsArgs = CommonArgs & {
    productId: string;
};
export declare type GetProductsArgs = CommonArgs & {
    keyword?: string;
    productIds?: string;
    category?: Category;
};
export declare type AlgoliaConfig = {
    appId: string;
    apiKey: string;
};
export declare type AmplienceConfig = {
    hub: string;
    hubId: string;
    stagingApi: string;
    imageHub?: string;
};
export declare type DemoStoreConfiguration = {
    algolia: AlgoliaConfig;
    url?: string;
    cms: AmplienceConfig;
    commerce?: any;
};
