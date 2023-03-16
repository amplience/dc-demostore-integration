"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRequest = exports.segmentsRequest = exports.collectionsRequest = void 0;
const queries_1 = require("../queries");
exports.collectionsRequest = {
    config: {
        url: ''
    },
    url: ''
};
exports.segmentsRequest = {
    config: {
        baseURL: 'https://site_id.myshopify.com/admin/api/version',
        headers: {
            'X-Shopify-Access-Token': 'admin_access_token'
        },
        url: 'graphql.json',
        query: queries_1.segments,
        variables: {
            pageSize: 100
        }
    },
    url: 'https://site_id.myshopify.com/admin/api/version/graphql.json'
};
exports.productsRequest = {
    config: {
        url: ''
    },
    url: ''
};
