export declare const categoriesRequest: {
    config: {
        baseURL: string;
        headers: {
            'X-Auth-Token': string;
            Accept: string;
            'Content-Type': string;
        };
        method: string;
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
        baseURL: string;
        headers: {
            Authorization: string;
        };
        method: string;
        url: string;
    };
    url: string;
};
