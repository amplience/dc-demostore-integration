import { QueryContext, Product, Category } from "../../../types";
import _ from "lodash";
declare const _default: {
    mapProduct: (product: Product, context: QueryContext) => {
        imageSetId: string;
        variants: {
            listPrice: string;
            salePrice: string;
            sku: string;
            defaultImage?: import("../../../types").ProductImage;
            images: import("../../../types").ProductImage[];
            attributes: _.Dictionary<string>;
        }[];
        shortDescription?: string;
        longDescription?: string;
        categories: Category[];
        productType?: string;
        slug: string;
        id: string;
        name: string;
    };
    mapCategory: (category: Category) => {
        key: string;
        parent?: Category;
        children: Category[];
        products: Product[];
        slug: string;
        id: string;
        name: string;
    };
};
export default _default;
