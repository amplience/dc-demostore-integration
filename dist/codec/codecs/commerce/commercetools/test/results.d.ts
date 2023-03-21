export declare const exampleCustomerGroups: {
    createdAt: string;
    createdBy: {
        clientId: string;
        isPlatformClient: boolean;
    };
    id: string;
    key: string;
    lastModifiedAt: string;
    lastModifiedBy: {
        clientId: string;
        isPlatformClient: boolean;
    };
    name: string;
    version: number;
}[];
export declare const exampleCategoryTree: {
    children: any[];
    id: string;
    name: string;
    products: any[];
    slug: string;
}[];
export declare const exampleProduct: (id: string) => {
    categories: any[];
    id: string;
    name: string;
    slug: string;
    variants: {
        attributes: {
            articleNumberMax: string;
            baseId: string;
        };
        images: {
            dimensions: {
                h: number;
                w: number;
            };
            url: string;
        }[];
        listPrice: string;
        salePrice: string;
        sku: string;
        id: string;
    }[];
};
