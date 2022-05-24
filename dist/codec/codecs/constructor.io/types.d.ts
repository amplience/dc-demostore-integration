export declare type ConstructorIO = {
    autocomplete: any;
    browse: Browse;
    catalog: Catalog;
    options: any;
    recommendations: any;
    search: Search;
    tasks: any;
    tracker: any;
};
export declare type Browse = {
    getBrowseResults: (filterName: any, filterValue: any, parameters?: any, userParameters?: any, networkParameters?: any) => Promise<any>;
};
export declare type Catalog = {
    getItem: ({ id, section }: {
        id: any;
        section: any;
    }, networkParameters?: any) => Promise<any>;
    getItemGroups: (networkParameters?: any) => Promise<any>;
};
export declare type Search = {
    getSearchResults: (query: any, parameters?: any, userParameters?: any, networkParameters?: any) => Promise<any>;
};
export interface ConstructorIOCategory {
    name: string;
    id: string;
    data: null;
    children: ConstructorIOCategory[];
}
export interface ConstructorIOProduct {
    name: string;
    suggested_score: number;
    id: string;
    metadata: ConstructorIOProductMetadata;
    url: string;
    group_ids: string[];
    image_url: string;
    variations: Variation[];
}
export interface ConstructorIOProductMetadata {
}
export interface Variation {
    name: string;
    suggested_score: number;
    id: string;
    metadata: VariationMetadata;
    url: string;
}
export interface VariationMetadata {
    sku: string;
    "image-0": string;
    listPrice: string;
    salePrice: string;
    "attribute-size": string;
    "attribute-color": string;
    "attribute-articleNumberMax": string;
}
export interface ConstructorIOSearchResult {
    matched_terms: string[];
    data: ConstructorIOSearchResultData;
    value: string;
    is_slotted: boolean;
    labels: Labels;
    variations: Variation[];
    result_id: string;
}
export interface ConstructorIOSearchResultData {
    id: string;
    url: string;
    image_url: string;
    group_ids: string[];
    variation_id: string;
}
export interface Labels {
}
export interface Variation {
    data: VariationData;
    value: string;
}
export interface VariationData {
    url: string;
    variation_id: string;
}
