export declare const exampleCustomerGroups: {
    id: string;
    name: string;
}[];
export declare const exampleMegaMenu: {
    id: string;
    name: string;
    slug: string;
    children: any[];
    products: any[];
}[];
export declare const exampleProduct: (id: string) => {
    id: string;
    shortDescription: string;
    longDescription: string;
    slug: string;
    name: string;
    categories: any[];
    variants: {
        sku: string;
        listPrice: string;
        salePrice: string;
        attributes: {};
    }[];
};
