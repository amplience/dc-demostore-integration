import { Product, Category, CommonArgs } from "../../../common/types";
import _ from "lodash";
declare const _default: {
    mapProduct: (product: Product, args: CommonArgs) => {
        variants: {
            listPrice: string;
            salePrice: string;
            sku: string;
            defaultImage?: import("../../../common/types").Image;
            images: import("../../../common/types").Image[];
            attributes: _.Dictionary<string>;
        }[];
        id: string;
        name: string;
        slug: string;
        shortDescription?: string;
        longDescription?: string;
        imageSetId?: string;
        categories: Category[];
    };
    mapCategory: (category: Category) => {
        key: string;
        id: string;
        name: string;
        slug: string;
        parent?: Category;
        image?: import("../../../common/types").Image;
        children: Category[];
        products: Product[];
    };
};
export default _default;
