export declare const categoriesRequest: {
    config: {
        method: string;
        baseURL: string;
        headers: {
            'X-Auth-Token': string;
            Accept: string;
            'Content-Type': string;
        };
        url: string;
    };
    url: string;
};
export declare const customerGroupsRequest: {
    config: {
        method: string;
        url: string;
        baseURL: string;
        headers: {
            'X-Auth-Token': string;
            Accept: string;
            'Content-Type': string;
        };
    };
    url: string;
};
export declare const searchRequest: (filter: string) => {
    config: {
        method: string;
        baseURL: string;
        headers: {
            'X-Auth-Token': string;
            Accept: string;
            'Content-Type': string;
        };
        url: string;
    };
    url: string;
};
