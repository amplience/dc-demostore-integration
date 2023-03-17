"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRequest = exports.customerGroupsRequest = exports.categoriesRequest = exports.oauthRequest = void 0;
exports.oauthRequest = {
    config: {
        auth: {
            password: 'test_secret',
            username: 'test_client',
        },
        data: {},
        url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials'
    },
    url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials'
};
exports.categoriesRequest = {
    config: {
        baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
        headers: {
            Authorization: 'Bearer token',
        },
        method: 'GET',
        url: '/categories?offset=0&limit=500',
    },
    url: 'https://api.europe-west1.gcp.commercetools.com/test/categories?offset=0&limit=500'
};
exports.customerGroupsRequest = {
    config: {
        baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
        headers: {
            'Authorization': 'Bearer token',
        },
        method: 'GET',
        url: '/customer-groups?offset=0&limit=20',
    },
    url: 'https://api.europe-west1.gcp.commercetools.com/test/customer-groups?offset=0&limit=20',
};
const searchRequest = (filter) => ({
    config: {
        baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
        headers: {
            Authorization: 'Bearer token',
        },
        method: 'GET',
        url: `/product-projections/search?${filter}`
    },
    url: `https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?${filter}`
});
exports.searchRequest = searchRequest;
