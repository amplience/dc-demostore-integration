import { Product, Category, CommonArgs } from "../../../types";
import _ from "lodash";
declare const _default: {
    mapProduct: (product: Product, args: CommonArgs) => {
        imageSetId: string;
        variants: {
            listPrice: string;
            salePrice: string;
            sku: string;
            defaultImage?: import("../../../types").Image;
            images: import("../../../types").Image[];
            attributes: _.Dictionary<string>;
        }[];
        shortDescription?: string;
        longDescription?: string;
        categories: Category[];
        slug: string;
        id: string;
        name: string;
    };
    mapCategory: (category: Category) => {
        key: string;
        parent?: Category;
        image?: import("../../../types").Image;
        children: Category[];
        products: Product[];
        slug: string;
        id: string;
        name: string;
    };
};
export default _default;
