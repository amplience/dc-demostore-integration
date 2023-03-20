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
const fixtures_1 = require("./fixtures");
jest.mock('axios');
describe('shopify integration', function () {
    let codec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
    }));
    test('getProduct (by id)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const result = yield codec.getProduct({ id: 'ExampleID' });
        expect(result).toEqual((0, results_1.exampleProduct)('ExampleID'));
        expect(requests).toEqual([
            (0, requests_1.productRequest)('ExampleID')
        ]);
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const result = yield codec.getProducts({
            productIds: 'ExampleID,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('ExampleID'),
            (0, requests_1.productRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('ExampleID'),
            (0, results_1.exampleProduct)('ExampleID2')
        ]);
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductsByKeywordRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const categories = yield codec.getProducts({ keyword: 'fulfilled' });
        expect(categories).toEqual(results_1.exampleProductsByKeyword);
        expect(requests).toEqual([
            requests_1.productsByKeywordRequest
        ]);
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductsByCategoryRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const products = yield codec.getProducts({
            category: {
                id: 'gid://shopify/Collection/439038837024',
                slug: 'hydrogen',
                name: 'Hydrogen',
                image: null,
                children: [],
                products: []
            }
        });
        expect(products).toEqual(results_1.exampleCategoryProducts.products);
        expect(requests).toEqual([
            requests_1.productsByCategoryRequest
        ]);
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductMissingRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const result = yield codec.getProduct({ id: 'MissingID' });
        expect(result).toBeNull();
        expect(requests).toEqual([
            (0, requests_1.productRequest)('MissingID')
        ]);
    }));
    test('getProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const result = yield codec.getProducts({
            productIds: 'ExampleID,MissingID,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('ExampleID'),
            (0, requests_1.productRequest)('MissingID'),
            (0, requests_1.productRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('ExampleID'),
            null,
            (0, results_1.exampleProduct)('ExampleID2')
        ]);
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const result = yield codec.getRawProducts({
            productIds: 'ExampleID,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('ExampleID'),
            (0, requests_1.productRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, responses_1.shopifyProduct)('ExampleID').data.product,
            (0, responses_1.shopifyProduct)('ExampleID2').data.product
        ]);
    }));
    test('getRawProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const result = yield codec.getRawProducts({
            productIds: 'ExampleID,MissingID,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productRequest)('ExampleID'),
            (0, requests_1.productRequest)('MissingID'),
            (0, requests_1.productRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, responses_1.shopifyProduct)('ExampleID').data.product,
            null,
            (0, responses_1.shopifyProduct)('ExampleID2').data.product
        ]);
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceProductsByCategoryRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const categories = yield codec.getCategory({ slug: 'hydrogen' });
        expect(categories).toEqual(results_1.exampleCategoryProducts);
        expect(requests).toEqual([
            requests_1.collectionsRequest,
            requests_1.productsByCategoryRequest
        ]);
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceCollectionsRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const categories = yield codec.getMegaMenu({});
        expect(categories).toEqual(results_1.exampleMegaMenu);
        expect(requests).toEqual([
            requests_1.collectionsRequest
        ]);
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        // Setup with the right fixture
        (0, rest_mock_1.massMock)(axios_1.default, requests, fixtures_1.commerceSegmentsRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        // Test
        const customerGroups = yield codec.getCustomerGroups({});
        expect(customerGroups).toEqual(results_1.exampleCustomerGroups);
        expect(requests).toEqual([
            requests_1.segmentsRequest
        ]);
    }));
});
