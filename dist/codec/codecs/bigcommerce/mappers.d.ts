import { Category, CustomerGroup, Product, Variant } from '../../../common/types';
import { BigCommerceCategory, BigCommerceCustomerGroup, BigCommerceProduct, BigCommerceVariant } from './types';
/**
 * TODO
 * @param category
 * @returns
 */
export declare const mapCategory: (category: BigCommerceCategory) => Category;
/**
 * TODO
 * @param variant
 * @param product
 * @returns
 */
export declare const mapVariant: (variant: BigCommerceVariant, product: BigCommerceProduct) => Variant;
/**
 * TODO
 * @param product
 * @returns
 */
export declare const mapVariantProduct: (product: BigCommerceProduct) => Variant;
/**
 * TODO
 * @param product
 * @returns
 */
export declare const mapProduct: (product: BigCommerceProduct) => Product;
/**
 * TODO
 * @param group
 * @returns
 */
export declare const mapCustomerGroup: (group: BigCommerceCustomerGroup) => CustomerGroup;
