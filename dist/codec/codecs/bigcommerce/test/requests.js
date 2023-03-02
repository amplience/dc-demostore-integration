"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCategoryRequest = exports.productRequest = exports.searchRequest = exports.customerGroupsRequest = exports.categoriesRequest = void 0;
// BigCommerce Category Hierarchy request
exports.categoriesRequest = {
    config: {
        method: 'get',
        baseURL: 'https://api.bigcommerce.com/stores/store_hash',
        headers: {
            'X-Auth-Token': 'api_token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
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
// BigCommerce Search request
const searchRequest = (filter) => ({
    config: {
        method: 'get',
        baseURL: 'https://api.bigcommerce.com/stores/store_hash',
        headers: {
            'X-Auth-Token': 'api_token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `/v3/catalog/products?keyword=${filter}`
    },
    url: `https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?keyword=${filter}`
});
exports.searchRequest = searchRequest;
// BigCommerce Product request
const productRequest = (id) => ({
    config: {
        method: 'get',
        baseURL: 'https://api.bigcommerce.com/stores/store_hash',
        headers: {
            'X-Auth-Token': 'api_token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `/v3/catalog/products?id:in=${id}&include=images,variants`
    },
    url: `https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=${id}&include=images,variants`
});
exports.productRequest = productRequest;
// BigCommerce Product (category) request
const productCategoryRequest = (id) => ({
    config: {
        method: 'get',
        baseURL: 'https://api.bigcommerce.com/stores/store_hash',
        headers: {
            'X-Auth-Token': 'api_token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `/v3/catalog/products?categories:in=${id}`
    },
    url: `https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?categories:in=${id}`
});
exports.productCategoryRequest = productCategoryRequest;
