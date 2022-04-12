import { Method } from 'axios';
import { Dictionary } from 'lodash';
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
    productType?: string;
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
export declare class GetCategoryArgs {
    id?: string;
    slug?: string;
}
export declare class GetCategoryProductArgs {
    full?: boolean;
    segment?: string;
}
export declare class GetProductsArgs {
    keyword?: string;
    segment?: string;
    productIds?: string;
}
export declare class GetProductArgs {
    id?: string;
    sku?: string;
    slug?: string;
    segment?: string;
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
    appUrl: string;
    method: Method;
}
export declare const qc: (args: any, locale?: string, language?: string, country?: string, currency?: string, segment?: string, appUrl?: string, method?: Method) => QueryContext;
export declare class DemoStoreConfiguration {
    algolia?: any;
    url?: string;
    cms?: any;
    commerce?: any;
    locator: string;
}
