export declare const collectionsRequest: {
    config: {
        baseURL: string;
        headers: {
            'X-Shopify-Storefront-Access-Token': string;
        };
        url: string;
        data: {
            query: string;
            variables: {
                pageSize: number;
                after: any;
            };
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
        data: {
            query: string;
            variables: {
                pageSize: number;
                after: any;
            };
        };
    };
    url: string;
};
export declare const productRequest: (id: string) => {
    config: {
        baseURL: string;
        headers: {
            'X-Shopify-Storefront-Access-Token': string;
        };
        url: string;
        data: {
            query: string;
            variables: {
                id: string;
            };
        };
    };
    url: string;
};
export declare const productsByKeywordRequest: {
    config: {
        baseURL: string;
        headers: {
            'X-Shopify-Storefront-Access-Token': string;
        };
        url: string;
        data: {
            query: string;
            variables: {
                pageSize: number;
                query: string;
                after: any;
            };
        };
    };
    url: string;
};
export declare const productsByCategoryRequest: {
    config: {
        baseURL: string;
        headers: {
            'X-Shopify-Storefront-Access-Token': string;
        };
        url: string;
        data: {
            query: string;
            variables: {
                pageSize: number;
                handle: string;
                after: any;
            };
        };
    };
    url: string;
};
