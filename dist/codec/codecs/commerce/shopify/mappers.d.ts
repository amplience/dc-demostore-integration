import { Category, CustomerGroup, Product, Variant, Image } from '../../../../common/types';
import { ShopifyCollection, ShopifyImage, ShopifyPrice, ShopifyProduct, ShopifySegment, ShopifyVariant } from './types';
/**
 * Find the first non-empty (not null or length 0) string in a list of strings.
 * @param strings List of strings to search
 * @returns The first non-empty string in the list
 */
export declare const firstNonEmpty: (strings: string[]) => string;
/**
 * Map a shopify price to the common price type.
 * @param price The shopify price
 * @returns The common price
 */
export declare const mapPrice: (price: ShopifyPrice) => string;
/**
 * Map a shopify collection to the common category type.
 * @param collection The shopify collection
 * @returns The common category
 */
export declare const mapCategory: (collection: ShopifyCollection) => Category;
/**
 * Map a shopify image to the common image type.
 * @param image The shopify image
 * @returns The common image
 */
export declare const mapImage: (image: ShopifyImage) => Image;
/**
 * Map a shopify product variant to the common product variant type.
 * @param variant The shopify product variant
 * @param sharedImages Images shared between each variant
 * @returns The common variant
 */
export declare const mapVariant: (variant: ShopifyVariant, sharedImages: ShopifyImage[]) => Variant;
/**
 * Map a shopify product to the common product type.
 * @param product The shopify product
 * @returns The common product
 */
export declare const mapProduct: (product: ShopifyProduct | null) => Product | null;
/**
 * Map a shopify segment to the common customer group type
 * @param segment The shopify segment
 * @returns The common customer group
 */
export declare const mapCustomerGroup: (segment: ShopifySegment) => CustomerGroup;
