"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commerceCollectionsRequests = exports.commerceSegmentsRequests = exports.commerceProductsByCategoryRequests = exports.commerceProductsByKeywordRequests = exports.commerceProductMissingRequests = exports.commerceProductRequests = void 0;
const rest_mock_1 = require("../../../../common/test/rest-mock");
const responses_1 = require("./test/responses");
const requests_1 = require("./test/requests");
exports.commerceProductRequests = {
    post: {
        'https://site_id.myshopify.com/api/version/graphql.json': (0, rest_mock_1.dataToResponse)([
            {
                data: (0, requests_1.productRequest)('ExampleID').config.data,
                response: {
                    data: (0, responses_1.shopifyProduct)('ExampleID')
                }
            },
            {
                data: (0, requests_1.productRequest)('ExampleID2').config.data,
                response: {
                    data: (0, responses_1.shopifyProduct)('ExampleID2')
                }
            },
            {
                data: (0, requests_1.productRequest)('MissingID').config.data,
                response: {
                    data: {
                        data: {
                            product: null
                        }
                    }
                }
            }
        ])
    }
};
exports.commerceProductMissingRequests = {
    post: {
        'https://site_id.myshopify.com/api/version/graphql.json': {
            data: {
                data: {
                    product: null
                }
            }
        }
    }
};
exports.commerceProductsByKeywordRequests = {
    post: {
        'https://site_id.myshopify.com/api/version/graphql.json': {
            data: responses_1.shopifyProductsByKeyword
        }
    }
};
exports.commerceProductsByCategoryRequests = {
    post: {
        'https://site_id.myshopify.com/api/version/graphql.json': (0, rest_mock_1.dataToResponse)([
            {
                data: requests_1.collectionsRequest.config.data,
                response: {
                    data: responses_1.shopifyCategories
                }
            },
            {
                data: requests_1.productsByCategoryRequest.config.data,
                response: {
                    data: responses_1.shopifyCategoryProducts
                }
            }
        ])
    }
};
exports.commerceSegmentsRequests = {
    post: {
        'https://site_id.myshopify.com/admin/api/version/graphql.json': {
            data: responses_1.shopifySegments
        }
    }
};
exports.commerceCollectionsRequests = {
    post: {
        'https://site_id.myshopify.com/api/version/graphql.json': {
            data: responses_1.shopifyCategories
        }
    }
};
