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
const rest_mock_1 = require("../../../common/test/rest-mock");
const axios_1 = __importDefault(require("axios"));
const _1 = __importStar(require("."));
const responses_1 = require("./test/responses");
const results_1 = require("./test/results");
const requests_1 = require("./test/requests");
const config_1 = require("./test/config");
const util_1 = require("../../../common/util");
jest.mock('axios');
const commerceRequests = {
    get: {
        'https://api.bigcommerce.com/stores/store_hash/v2/customer_groups': {
            data: responses_1.bigcommerceCustomerGroups
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/categories/tree': {
            data: {
                data: responses_1.bigcommerceCategories
            }
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=1&include=images,variants': {
            data: {
                data: (0, responses_1.bigcommerceProduct)(1)
            }
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=1,3&include=images,variants': {
            data: {
                data: [
                    ...(0, responses_1.bigcommerceProduct)(1),
                    ...(0, responses_1.bigcommerceProduct)(3)
                ]
            }
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?keyword=keyword': {
            data: {
                data: [
                    ...(0, responses_1.bigcommerceProduct)(2),
                    ...(0, responses_1.bigcommerceProduct)(3),
                    ...(0, responses_1.bigcommerceProduct)(4)
                ]
            }
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?categories:in=1': {
            data: {
                data: [
                    ...(0, responses_1.bigcommerceProduct)(1),
                    ...(0, responses_1.bigcommerceProduct)(3)
                ]
            }
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=-1&include=images,variants': {
            data: {
                data: []
            }
        },
        'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=1,-1,3&include=images,variants': {
            data: {
                data: [
                    ...(0, responses_1.bigcommerceProduct)(1),
                    null,
                    ...(0, responses_1.bigcommerceProduct)(3)
                ]
            }
        },
    }
};
// BigCommerce Integration tests
describe('bigcommerce integration', function () {
    let codec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
        (0, rest_mock_1.massMock)(axios_1.default, requests, commerceRequests);
        codec = new _1.BigCommerceCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
    }));
    // Get BigCommerce Product
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProduct({
            id: '1'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('1')
        ]);
        expect(result).toEqual((0, results_1.exampleProduct)('1'));
    }));
    // Get BigCommerce Products
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            productIds: '1,3'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('1,3')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('1'),
            (0, results_1.exampleProduct)('3')
        ]);
    }));
    // Get BigCommerce Products (filter by keyword in name or sku)
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            keyword: 'keyword'
        });
        expect(requests).toEqual([
            (0, requests_1.searchRequest)('keyword')
        ]);
        expect(result).toEqual(Array.from({ length: 3 }).map((_, index) => (0, results_1.exampleProduct)(`${index + 2}`)));
    }));
    // Get BigCommerce Products (from category)
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield codec.getProducts({
            category: {
                children: [],
                products: [],
                id: '1',
                name: 'Category',
                slug: 'category',
            }
        });
        expect(requests).toEqual([
            (0, requests_1.productCategoryRequest)(1)
        ]);
        expect(products).toEqual([
            (0, results_1.exampleProduct)('1'),
            (0, results_1.exampleProduct)('3')
        ]);
    }));
    // Get BigCommerce Product (missing ID)
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProduct({
            id: '-1'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('-1')
        ]);
        expect(result).toBeNull();
    }));
    // Get BigCommerce Products (one is missing)
    test('getProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            productIds: '1,-1,3'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('1,-1,3')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('1'),
            null,
            (0, results_1.exampleProduct)('3')
        ]);
    }));
    // Get BigCommerce Products (raw, original value)
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getRawProducts({
            productIds: '1'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('1')
        ]);
        expect(result).toEqual((0, responses_1.bigcommerceProduct)(1));
    }));
    // Get BigCommerce Products (raw and one missing ID)
    test('getRawProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getRawProducts({
            productIds: '1,-1,3'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('1,-1,3')
        ]);
        expect(result).toEqual([
            ...(0, responses_1.bigcommerceProduct)(1),
            null,
            ...(0, responses_1.bigcommerceProduct)(3)
        ]);
    }));
    // Get BigCommerce Category with Products
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        const category = yield codec.getCategory({ slug: 'men' });
        expect(requests).toEqual([
            requests_1.categoriesRequest,
            (0, requests_1.productCategoryRequest)(1)
        ]);
        expect(category).toEqual({
            children: [],
            products: [
                (0, results_1.exampleProduct)('1'),
                (0, results_1.exampleProduct)('3')
            ],
            id: '1',
            name: 'Men',
            slug: 'men',
        });
    }));
    // Get Category Hierarchy
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        const megaMenu = yield codec.getMegaMenu({});
        expect(requests).toEqual([
            requests_1.categoriesRequest
        ]);
        expect(megaMenu).toEqual(results_1.exampleMegaMenu);
    }));
    // Get Customer Groups
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        const customerGroups = yield codec.getCustomerGroups({});
        expect(customerGroups).toEqual(results_1.exampleCustomerGroups);
        expect(requests).toEqual([
            requests_1.customerGroupsRequest
        ]);
    }));
});
