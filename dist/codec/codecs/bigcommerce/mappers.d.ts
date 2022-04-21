import { Category, CustomerGroup, Product } from "../../../types";
import { BigCommerceCategory, BigCommerceCustomerGroup, BigCommerceProduct } from "./types";
export declare const mapCategory: (category: BigCommerceCategory) => Category;
export declare const mapProduct: (product: BigCommerceProduct) => Product;
export declare const mapCustomerGroup: (group: BigCommerceCustomerGroup) => CustomerGroup;
