import { Method } from 'axios';
export declare class Prices {
    sale?: string;
    list?: string;
}
export declare class ProductImage {
    url: string;
    large?: string;
    thumb?: string;
}
export declare class ResultsMeta {
    limit: number;
    offset: number;
    count: number;
    total: number;
}
export declare class ProductResults {
    meta: ResultsMeta;
    results: [Product];
}
export declare class CategoryResults {
    meta: ResultsMeta;
    results: [Category];
}
export declare class Identifiable {
    id: string;
}
export declare class Keyed extends Identifiable {
    key: string;
}
export declare class CommerceObject extends Keyed {
    slug: string;
    name: string;
}
export declare class Product extends CommerceObject {
    shortDescription?: string;
    longDescription?: string;
    imageSetId?: string;
    categories: Category[];
    variants: Variant[];
    productType: string;
}
export declare class Attribute {
    name: string;
    value: string;
}
export declare class Variant extends Keyed {
    sku: string;
    prices: Prices;
    listPrice: string;
    salePrice: string;
    defaultImage?: ProductImage;
    images: ProductImage[];
    attributes: Attribute[];
    color?: string;
    size?: string;
    articleNumberMax?: string;
}
export declare class Category extends CommerceObject {
    parent?: Category;
    children: Category[];
    products: Product[];
}
export declare class SearchResult {
    products: Product[];
}
export declare type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
};
export declare class CommonArgs {
}
export declare class ListArgs extends CommonArgs {
    limit?: number;
    offset?: number;
}
export declare class GetCategoryArgs extends CommonArgs {
    id?: string;
    slug?: string;
}
export declare class GetCategoryProductArgs extends CommonArgs {
    full?: boolean;
    segment?: string;
}
export declare class GetProductsArgs extends ListArgs {
    keyword?: string;
    segment?: string;
    productIds?: string;
}
export declare class GetProductArgs extends CommonArgs {
    id?: string;
    sku?: string;
    slug?: string;
    segment?: string;
}
export declare class GetAttributeArgs {
    name: string;
}
export declare class QueryContext {
    args: any;
    locale: string;
    language: string;
    country: string;
    currency: string;
    segment: string;
    appUrl: string;
    method: Method;
    constructor(obj?: any);
    getLocale(): string;
}
export declare class AMPRSAConfiguration {
    algolia?: any;
    url?: string;
    cms?: any;
    commerce?: any;
}
declare const _default: {
    QueryContext: typeof QueryContext;
};
export default _default;
