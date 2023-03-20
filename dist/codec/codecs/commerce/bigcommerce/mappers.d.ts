import { Category, CustomerGroup, Product, Variant } from '../../../../common/types';
import { BigCommerceCategory, BigCommerceCustomerGroup, BigCommerceProduct, BigCommerceVariant } from './types';
/**
 * Map a bigcommerce category to the common category type.
 * @param category The bigcommerce category
 * @returns The common category
 */
export declare const mapCategory: (category: BigCommerceCategory) => Category;
/**
 * Map a bigcommerce product variant to the common product variant type.
 * @param variant The bigcommerce product variant
 * @param product The bigcommerce product
 * @returns The common variant
 */
export declare const mapVariant: (variant: BigCommerceVariant, product: BigCommerceProduct) => Variant;
/**
 * Map a bigcommerce product to the common product variant type.
 * @param product The bigcommerce product
 * @returns The common variant
 */
export declare const mapVariantProduct: (product: BigCommerceProduct) => Variant;
/**
 * Map a bigcommerce product to the common product type
 * @param product The bigcommerce product
 * @returns The common product
 */
export declare const mapProduct: (product: BigCommerceProduct) => Product;
/**
 * Map a bigcommerce customer group to the common customer group type
 * @param group The bigcommerce customer group
 * @returns The common customer group
 */
export declare const mapCustomerGroup: (group: BigCommerceCustomerGroup) => CustomerGroup;
