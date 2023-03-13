export declare const categoryRequest: {
    config: {
        baseURL: string;
        params: {
            client_id: string;
        };
        url: string;
    };
    url: string;
};
export declare const productIdRequest: (id: string) => {
    config: {
        baseURL: string;
        params: {
            client_id: string;
        };
        url: string;
    };
    url: string;
};
export declare const oauthRequest: {
    config: {
        url: string;
    };
    url: string;
};
export declare const customerGroupsRequest: {
    config: {
        method: string;
        baseURL: string;
        headers: {
            Authorization: string;
        };
        url: string;
    };
    url: string;
};
export declare const productIdRequests: (id: string, total: number) => {
    config: {
        baseURL: string;
        params: {
            client_id: string;
        };
        url: string;
    };
    url: string;
}[];
export declare const keywordSearch: (start: number) => {
    config: {
        baseURL: string;
        params: {
            client_id: string;
        };
        url: string;
    };
    url: string;
};
export declare const categorySearch: (start: number) => {
    config: {
        baseURL: string;
        params: {
            client_id: string;
        };
        url: string;
    };
    url: string;
};
