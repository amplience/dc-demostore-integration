"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRequest = exports.segmentsRequest = exports.collectionsRequest = void 0;
const queries_1 = require("../queries");
exports.collectionsRequest = {
    config: {
        baseURL: 'https://site_id.myshopify.com/api/version',
        headers: {
            'X-Shopify-Storefront-Access-Token': 'access_token'
        },
        url: 'graphql.json',
        query: queries_1.collections,
        variables: {
            pageSize: 100
        }
    },
    url: 'https://site_id.myshopify.com/api/version/graphql.json'
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
const productRequest = (id) => ({
    config: {
        baseURL: 'https://site_id.myshopify.com/api/version',
        headers: {
            'X-Shopify-Storefront-Access-Token': 'access_token'
        },
        url: 'graphql.json',
        query: queries_1.productById,
        variables: {
            id: 'ExampleID'
        }
    },
    url: 'https://site_id.myshopify.com/api/version/graphql.json'
});
exports.productRequest = productRequest;
