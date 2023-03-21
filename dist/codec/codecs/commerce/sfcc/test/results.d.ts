import { Category } from '../../../../../common';
export declare const exampleProduct: (id: string) => {
    categories: any[];
    id: string;
    longDescription: string;
    name: string;
    shortDescription: string;
    slug: string;
    variants: {
        attributes: {
            color: string;
            size: string;
        };
        images: {
            url: string;
        }[];
        listPrice: string;
        salePrice: string;
        sku: string;
        id: string;
    }[];
};
export declare const exampleCategoryTree: Category[];
export declare const exampleCustomerGroups: {
    _resource_state: string;
    _type: string;
    id: string;
    link: string;
    name: string;
}[];
