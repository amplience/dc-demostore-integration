import { Category } from "../../types";
declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
declare const flattenCategories: (categories: Category[]) => Category[];
export { findInMegaMenu, flattenCategories };
