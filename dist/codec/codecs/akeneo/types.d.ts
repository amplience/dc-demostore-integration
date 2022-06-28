export interface AkeneoCategory {
    _links: Links;
    code: string;
    parent: string;
    updated: string;
    labels: {
        [key: string]: string;
    };
}
export interface Links {
    self: Self;
}
export interface Self {
    href: string;
}
export interface AkeneoProduct {
    _links: AkeneoProductLinks;
    identifier: string;
    enabled: boolean;
    family: string;
    categories: string[];
    groups: any[];
    parent: string;
    values: Values;
    created: string;
    updated: string;
    associations: Associations;
    quantified_associations: QuantifiedAssociations;
    metadata: Metadata;
}
export interface AkeneoProductLinks {
    self: Self;
}
export interface Self {
    href: string;
}
export interface Associations {
    set: Pack;
    PACK: Pack;
    UPSELL: Pack;
    X_SELL: Pack;
    outfit: Pack;
    SUBSTITUTION: Pack;
}
export interface Pack {
    products: any[];
    product_models: any[];
    groups: any[];
}
export interface Metadata {
    workflow_status: string;
}
export interface QuantifiedAssociations {
}
export interface Values {
    [key: string]: AkeneoProperty[];
}
export interface AkeneoProperty {
    locale: string;
    scope: string;
    data: any;
}
