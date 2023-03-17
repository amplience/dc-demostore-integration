"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsByCategoryRequest = exports.productsByKeywordRequest = exports.productRequest = exports.segmentsRequest = exports.collectionsRequest = void 0;
const queries_1 = require("../queries");
exports.collectionsRequest = {
    config: {
        baseURL: 'https://site_id.myshopify.com/api/version',
        headers: {
            'X-Shopify-Storefront-Access-Token': 'access_token'
        },
        url: 'graphql.json',
        data: {
            query: queries_1.collections,
            variables: {
                pageSize: 100,
                after: undefined
            }
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
        data: {
            query: queries_1.segments,
            variables: {
                pageSize: 100,
                after: undefined
            }
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
        data: {
            query: queries_1.productById,
            variables: {
                id
            }
        }
    },
    url: 'https://site_id.myshopify.com/api/version/graphql.json'
});
exports.productRequest = productRequest;
exports.productsByKeywordRequest = {
    config: {
        baseURL: 'https://site_id.myshopify.com/api/version',
        headers: {
            'X-Shopify-Storefront-Access-Token': 'access_token'
        },
        url: 'graphql.json',
        data: {
            query: queries_1.productsByQuery,
            variables: {
                pageSize: 100,
                query: 'fulfilled',
                after: undefined
            }
        }
    },
    url: 'https://site_id.myshopify.com/api/version/graphql.json'
};
exports.productsByCategoryRequest = {
    config: {
        baseURL: 'https://site_id.myshopify.com/api/version',
        headers: {
            'X-Shopify-Storefront-Access-Token': 'access_token'
        },
        url: 'graphql.json',
        data: {
            query: queries_1.productsByCategory,
            variables: {
                pageSize: 100,
                handle: 'hydrogen',
                after: undefined
            }
        }
    },
    url: 'https://site_id.myshopify.com/api/version/graphql.json'
};
