import { QueryContext, Product, Category } from "../../../types";
declare const _default: {
    mapProduct: (product: Product, context: QueryContext) => {
        imageSetId: string;
        variants: {
            articleNumberMax: string;
            size: string;
            color: string;
            listPrice: string;
            salePrice: string;
            sku: string;
            prices: import("../../../types").Prices;
            defaultImage?: import("../../../types").ProductImage;
            images: import("../../../types").ProductImage[];
            attributes: import("../../../types").Attribute[];
            key: string;
            id: string;
        }[];
        shortDescription?: string;
        longDescription?: string;
        categories: Category[];
        productType?: string;
        slug: string;
        name: string;
        key: string;
        id: string;
    };
    mapCategory: (category: Category) => {
        key: string;
        parent?: Category;
        children: Category[];
        products: Product[];
        slug: string;
        name: string;
        id: string;
    };
};
export default _default;
