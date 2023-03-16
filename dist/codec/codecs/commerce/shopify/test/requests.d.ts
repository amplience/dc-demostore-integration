export declare const collectionsRequest: {
    config: {
        baseURL: string;
        headers: {
            'X-Shopify-Storefront-Access-Token': string;
        };
        url: string;
        query: string;
        variables: {
            pageSize: number;
        };
    };
    url: string;
};
export declare const segmentsRequest: {
    config: {
        baseURL: string;
        headers: {
            'X-Shopify-Access-Token': string;
        };
        url: string;
        query: string;
        variables: {
            pageSize: number;
        };
    };
    url: string;
};
export declare const productsRequest: {
    config: {
        url: string;
    };
    url: string;
};
