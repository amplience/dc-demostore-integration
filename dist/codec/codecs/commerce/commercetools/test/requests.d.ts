export declare const oauthRequest: {
    config: {
        auth: {
            password: string;
            username: string;
        };
        data: {};
        url: string;
    };
    url: string;
};
export declare const categoriesRequest: {
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
export declare const customerGroupsRequest: {
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
