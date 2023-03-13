"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySearch = exports.keywordSearch = exports.productIdRequests = exports.customerGroupsRequest = exports.oauthRequest = exports.productIdRequest = exports.categoryRequest = void 0;
exports.categoryRequest = {
    config: {
        baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
        params: {
            client_id: 'test-client',
        },
        url: '/s/TestSite/dw/shop/v22_4/categories/root?levels=4',
    },
    url: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/categories/root?levels=4'
};
const productIdRequest = (id) => ({
    config: {
        baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
        params: {
            client_id: 'test-client',
        },
        url: `/s/TestSite/dw/shop/v22_4/products/${id}?expand=prices,options,images,variations&all_images=true`,
    },
    url: `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?expand=prices,options,images,variations&all_images=true`,
});
exports.productIdRequest = productIdRequest;
exports.oauthRequest = {
    config: {
        url: 'https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials'
    },
    url: 'https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials'
};
exports.customerGroupsRequest = {
    config: {
        method: 'GET',
        baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
        headers: {
            Authorization: 'Bearer token',
        },
        url: '/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000',
    },
    url: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000'
};
const productIdRequests = (id, total) => Array.from({ length: total }).map((_, index) => (0, exports.productIdRequest)(id + index));
exports.productIdRequests = productIdRequests;
const keywordSearch = (start) => ({
    config: {
        baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
        params: {
            client_id: 'test-client',
        },
        url: `/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=${start}&count=200`,
    },
    url: `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=${start}&count=200`,
});
exports.keywordSearch = keywordSearch;
const categorySearch = (start) => ({
    config: {
        baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
        params: {
            client_id: 'test-client',
        },
        url: `/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=${start}&count=200`,
    },
    url: `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=${start}&count=200`,
});
exports.categorySearch = categorySearch;
