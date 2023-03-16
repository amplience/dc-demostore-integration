export declare const exampleCustomerGroups: {
    id: string;
    name: string;
}[];
export declare const exampleMegaMenu: {
    id: string;
    slug: string;
    name: string;
    image: any;
    children: any[];
    products: any[];
}[];
export declare const exampleProduct: (id: string) => {
    id: string;
    name: string;
    slug: string;
    categories: {
        id: string;
        slug: string;
        name: string;
        image: any;
        children: any[];
        products: any[];
    }[];
    variants: {
        sku: string;
        listPrice: string;
        salePrice: string;
        attributes: {
            Title: string;
        };
        images: {
            id: string;
            url: string;
            altText: string;
        }[];
    }[];
    shortDescription: string;
    longDescription: string;
};
export declare const exampleCategoryProducts: {
    id: string;
    slug: string;
    name: string;
    image: any;
    children: any[];
    products: {
        id: string;
        name: string;
        slug: string;
        categories: {
            id: string;
            slug: string;
            name: string;
            image: any;
            children: any[];
            products: any[];
        }[];
        variants: {
            sku: string;
            listPrice: string;
            salePrice: string;
            attributes: {
                Title: string;
            };
            images: {
                id: string;
                url: string;
                altText: string;
            }[];
        }[];
        shortDescription: string;
        longDescription: string;
    }[];
};
export declare const exampleProductsByKeyword: {
    id: string;
    name: string;
    slug: string;
    categories: any[];
    variants: {
        sku: string;
        listPrice: string;
        salePrice: string;
        attributes: {
            Title: string;
        };
        images: {
            id: string;
            url: string;
            altText: string;
        }[];
    }[];
    shortDescription: string;
    longDescription: string;
}[];
