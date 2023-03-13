"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_mock_1 = require("../../../../common/test/rest-mock");
const axios_1 = __importDefault(require("axios"));
const _1 = __importStar(require("."));
const responses_1 = require("./test/responses");
const results_1 = require("./test/results");
const requests_1 = require("./test/requests");
const config_1 = require("./test/config");
const util_1 = require("../../../../common/util");
jest.mock('axios');
const commerceRequests = {
    get: {
        'https://api.europe-west1.gcp.commercetools.com/test/categories?offset=0&limit=500': {
            data: responses_1.ctoolsCategories
        },
        'https://api.europe-west1.gcp.commercetools.com/test/customer-groups?offset=0&limit=20': {
            data: responses_1.ctoolsCustomerGroups
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=id%3A%22ExampleID%22&offset=0&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(1, 20, 0, ['ExampleID'])
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=id%3A%22ExampleID%22%2C%22ExampleID2%22&offset=0&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(2, 20, 0, ['ExampleID', 'ExampleID2'])
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=id%3A%22ExampleID%22%2C%22NotHere%22%2C%22ExampleID2%22&offset=0&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(2, 20, 0, ['ExampleID', 'ExampleID2'])
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=id%3A%22MissingID%22&offset=0&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(0, 20, 0, [])
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?text.en=%22Hit%22&offset=0&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(30, 20, 0)
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?text.en=%22Hit%22&offset=20&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(30, 20, 1)
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(30, 20, 0)
        },
        'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20': {
            data: (0, responses_1.ctoolsSearchResult)(30, 20, 1)
        }
    },
    post: {
        'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials': {
            data: {
                access_token: 'token',
                token_type: 'Bearer',
                expires_in: 172775,
                scope: 'view_discount_codes:test view_categories:test view_cart_discounts:test view_customers:test view_product_selections:test view_published_products:test view_customer_groups:test view_products:test'
            }
        }
    }
};
describe('commercetools integration', function () {
    let codec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
        (0, rest_mock_1.massMock)(axios_1.default, requests, commerceRequests);
        codec = new _1.CommercetoolsCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
    }));
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProduct({
            id: 'ExampleID'
        });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=id%3A%22ExampleID%22&offset=0&limit=20')
        ]);
        expect(result).toEqual((0, results_1.exampleProduct)('ExampleID'));
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            productIds: 'ExampleID,ExampleID2'
        });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=id%3A%22ExampleID%22%2C%22ExampleID2%22&offset=0&limit=20')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('ExampleID'),
            (0, results_1.exampleProduct)('ExampleID2')
        ]);
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            keyword: 'Hit'
        });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('text.en=%22Hit%22&offset=0&limit=20'),
            (0, requests_1.searchRequest)('text.en=%22Hit%22&offset=20&limit=20')
        ]);
        expect(result).toEqual(Array.from({ length: 30 }).map((_, index) => (0, results_1.exampleProduct)('Hit' + index)));
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield codec.getProducts({ category: {
                children: [],
                products: [],
                id: 'men-id',
                name: 'Men',
                slug: 'men',
            } });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20'),
            (0, requests_1.searchRequest)('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20')
        ]);
        expect(products.length).toEqual(30);
        expect(products).toEqual(Array.from({ length: 30 }).map((_, index) => (0, results_1.exampleProduct)('Hit' + index)));
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(codec.getProduct({
            id: 'MissingID'
        })).resolves.toBeNull();
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=id%3A%22MissingID%22&offset=0&limit=20')
        ]);
    }));
    test('getProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            productIds: 'ExampleID,NotHere,ExampleID2'
        });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=id%3A%22ExampleID%22%2C%22NotHere%22%2C%22ExampleID2%22&offset=0&limit=20')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('ExampleID'),
            null,
            (0, results_1.exampleProduct)('ExampleID2')
        ]);
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getRawProducts({
            productIds: 'ExampleID'
        });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=id%3A%22ExampleID%22&offset=0&limit=20')
        ]);
        expect(result).toEqual([
            (0, responses_1.ctoolsProduct)('ExampleID')
        ]);
    }));
    test('getRawProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getRawProducts({
            productIds: 'ExampleID,NotHere,ExampleID2'
        });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            (0, requests_1.searchRequest)('filter=id%3A%22ExampleID%22%2C%22NotHere%22%2C%22ExampleID2%22&offset=0&limit=20')
        ]);
        expect(result).toEqual([
            (0, responses_1.ctoolsProduct)('ExampleID'),
            null,
            (0, responses_1.ctoolsProduct)('ExampleID2')
        ]);
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        const category = yield codec.getCategory({ slug: 'men' });
        expect(requests).toEqual([
            requests_1.oauthRequest,
            requests_1.categoriesRequest,
            (0, requests_1.searchRequest)('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20'),
            (0, requests_1.searchRequest)('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20')
        ]);
        expect(category.products.length).toEqual(30);
        expect(category).toEqual({
            children: [],
            products: Array.from({ length: 30 }).map((_, index) => (0, results_1.exampleProduct)('Hit' + index)),
            id: 'men-id',
            name: 'Men',
            slug: 'men',
        });
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        const megaMenu = yield codec.getMegaMenu({});
        expect(requests).toEqual([
            requests_1.oauthRequest,
            requests_1.categoriesRequest
        ]);
        expect(megaMenu).toEqual(results_1.exampleMegaMenu);
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        const customerGroups = yield codec.getCustomerGroups({});
        expect(customerGroups).toEqual(results_1.exampleCustomerGroups);
        expect(requests).toEqual([
            requests_1.oauthRequest,
            requests_1.customerGroupsRequest
        ]);
    }));
});
