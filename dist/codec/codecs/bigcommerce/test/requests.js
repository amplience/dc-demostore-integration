"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRequest = exports.customerGroupsRequest = exports.categoriesRequest = void 0;
// BigCommerce Category Hierarchy request
exports.categoriesRequest = {
    config: {
        baseURL: 'https://api.bigcommerce.com/stores/store_hash',
        headers: {
            'X-Auth-Token': 'api_token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET',
        url: '/v3/catalog/categories/tree',
    },
    url: 'https://api.bigcommerce.com/stores/store_hash/v3/catalog/categories/tree'
};
// BigCommerce Customer Groups request
exports.customerGroupsRequest = {
    config: {
        method: 'get',
        url: '/v2/customer_groups',
        baseURL: 'https://api.bigcommerce.com/stores/store_hash',
        headers: {
            'X-Auth-Token': 'api_token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    },
    url: 'https://api.bigcommerce.com/stores/store_hash/v2/customer_groups',
};
// TODO
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
