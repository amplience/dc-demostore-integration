import { Category, CustomerGroup, Product } from '../../../../../common';
export declare const rootCategory: Category;
export declare const childCategories: Category[];
export declare const categories: Category[];
export declare const groups: CustomerGroup[];
export declare const restProduct: (id: string, label: string, category: Category) => Product;
export declare const products: Product[];
