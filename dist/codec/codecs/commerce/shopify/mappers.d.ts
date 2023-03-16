import { Category, CustomerGroup, Product, Variant } from "../../../../common/types";
import { ShopifyCollection, ShopifyImage, ShopifyPrice, ShopifyProduct, ShopifySegment, ShopifyVariant } from "./types";
/**
 * TODO
 * @param strings
 * @returns
 */
export declare const firstNonEmpty: (strings: string[]) => string;
/**
 * TODO
 * @param price
 * @returns
 */
export declare const mapPrice: (price: ShopifyPrice) => string;
/**
 * TODO
 * @param collection
 * @returns
 */
export declare const mapCategory: (collection: ShopifyCollection) => Category;
/**
 * TODO
 * @param variant
 * @param sharedImages
 * @returns
 */
export declare const mapVariant: (variant: ShopifyVariant, sharedImages: ShopifyImage[]) => Variant;
/**
 * TODO
 * @param product
 * @returns
 */
export declare const mapProduct: (product: ShopifyProduct) => Product;
/**
 * TODO
 * @param segment
 * @returns
 */
export declare const mapCustomerGroup: (segment: ShopifySegment) => CustomerGroup;
