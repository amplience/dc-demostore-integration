import { Category, CustomerGroup, Product, Variant } from "../../../types";
import { BigCommerceCategory, BigCommerceCustomerGroup, BigCommerceProduct, BigCommerceVariant } from "./types";
export declare const mapCategory: (category: BigCommerceCategory) => Category;
export declare const mapVariant: (variant: BigCommerceVariant, product: BigCommerceProduct) => Variant;
export declare const mapVariantProduct: (product: BigCommerceProduct) => Variant;
export declare const mapProduct: (product: BigCommerceProduct) => Product;
export declare const mapCustomerGroup: (group: BigCommerceCustomerGroup) => CustomerGroup;
