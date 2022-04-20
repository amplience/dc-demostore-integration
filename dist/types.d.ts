import { Dictionary } from 'lodash';
import { CodecConfiguration } from './codec';
export declare class Image {
    url: string;
    thumb?: string;
}
export declare class Identifiable {
    id: string;
    name: string;
}
export declare class CustomerGroup extends Identifiable {
}
export declare class CommerceObject extends Identifiable {
    slug: string;
}
export declare class Product extends CommerceObject {
    shortDescription?: string;
    longDescription?: string;
    imageSetId?: string;
    categories: Category[];
    variants: Variant[];
}
export declare class Variant {
    sku: string;
    listPrice: string;
    salePrice: string;
    defaultImage?: Image;
    images: Image[];
    attributes: Dictionary<string>;
}
export declare class Category extends CommerceObject {
    parent?: Category;
    image?: Image;
    children: Category[];
    products: Product[];
}
export declare class Promotion extends Identifiable {
    description: string;
    promoCode?: string;
    isActive: boolean;
    image?: Image;
}
export declare class GetAttributeArgs {
    name: string;
}
export interface QueryContext {
    args: any;
    locale: string;
    language: string;
    country: string;
    currency: string;
    segment: string;
}
export interface CommonArgs {
    [key: string]: any;
    locale?: string;
    language?: string;
    country?: string;
    currency?: string;
    segment?: string;
}
export interface GetCommerceObjectArgs extends CommonArgs {
    id?: string;
    slug?: string;
}
export interface GetProductsArgs extends CommonArgs {
    keyword?: string;
    productIds?: string;
}
export declare class DemoStoreConfiguration {
    algolia?: any;
    url?: string;
    cms?: any;
    commerce?: CodecConfiguration;
}
