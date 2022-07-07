import { Category, CommonArgs, Product } from "../../../common/types";
import { AkeneoCategory, AkeneoProduct } from "./types";
export declare const mapCategory: (categories: AkeneoCategory[]) => (category: AkeneoCategory) => Category;
export declare const mapProduct: (args: CommonArgs) => (product: AkeneoProduct) => Product;
