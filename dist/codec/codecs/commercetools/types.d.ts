import { OAuthCodecConfiguration } from "../../../common/rest-client";
export interface CommerceToolsCodecConfiguration extends OAuthCodecConfiguration {
    client_id: string;
    client_secret: string;
    project: string;
    scope: string;
}
export interface CTCategory {
    id: string;
    version: number;
    lastMessageSequenceNumber: number;
    createdAt: string;
    lastModifiedAt: string;
    lastModifiedBy: EdBy;
    createdBy: EdBy;
    key: string;
    name: Localizable;
    slug: Localizable;
    ancestors: Parent[];
    parent: Parent;
    orderHint: string;
    externalId: string;
    assets: any[];
}
export interface Parent {
    typeId: string;
    id: string;
}
export interface EdBy {
    clientId: string;
    isPlatformClient: boolean;
}
export interface Localizable {
    fr: string;
    it: string;
    en: string;
    de: string;
    es: string;
}
export interface CTProduct {
    id: string;
    version: number;
    productType: CTType;
    name: Localizable;
    categories: CTType[];
    categoryOrderHints: CategoryOrderHints;
    slug: Localizable;
    masterVariant: CTVariant;
    variants: CTVariant[];
    searchKeywords: CategoryOrderHints;
    hasStagedChanges: boolean;
    published: boolean;
    key: string;
    taxCategory: CTType;
    createdAt: string;
    lastModifiedAt: string;
}
export interface CTType {
    typeId: string;
    id: string;
}
export interface CategoryOrderHints {
}
export interface CTVariant {
    id: number;
    sku: string;
    prices: CTPrice[];
    images: Image[];
    attributes: Attribute[];
    assets: any[];
}
export interface Attribute {
    name: string;
    value: ValueValue | string;
}
export interface ValueValue extends Localizable {
    key?: string;
    label?: Localizable | string;
}
export interface Image {
    url: string;
    dimensions: {
        w: number;
        h: number;
    };
}
export interface CTPrice {
    id: string;
    value: DiscountedValue;
    discounted: Discounted;
    customerGroup?: CTType;
    country?: string;
    channel?: CTType;
}
export interface Discounted {
    value: DiscountedValue;
    discount: CTType;
}
export interface DiscountedValue {
    type: Type;
    currencyCode: CurrencyCode;
    centAmount: number;
    fractionDigits: number;
}
export declare enum CurrencyCode {
    Eur = "EUR",
    Usd = "USD"
}
export declare enum Type {
    CentPrecision = "centPrecision"
}
