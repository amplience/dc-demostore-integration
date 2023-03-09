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
const _1 = __importStar(require("."));
const rest_mock_1 = require("../../../common/test/rest-mock");
const axios_1 = __importDefault(require("axios"));
const responses_1 = require("./test/responses");
const requests_1 = require("./test/requests");
const results_1 = require("./test/results");
const config_1 = require("./test/config");
const util_1 = require("../../../common/util");
jest.mock('axios');
const sfccRequests = {
    get: Object.assign(Object.assign({ 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/categories/root': {
            data: responses_1.sfccCategories
        }, 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/ExampleID': {
            data: (0, responses_1.sfccProduct)('ExampleID')
        }, 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/ExampleID2': {
            data: (0, responses_1.sfccProduct)('ExampleID2')
        } }, (0, responses_1.sfccProducts)('Hit', 300)), { 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=0&count=200': {
            data: (0, responses_1.sfccSearchResult)(300, 200, 0, 'newarrivals-womens')
        }, 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=200&count=200': {
            data: (0, responses_1.sfccSearchResult)(300, 200, 1, 'newarrivals-womens')
        }, 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=0&count=200': {
            data: (0, responses_1.sfccSearchResult)(300, 200, 0, 'Hit')
        }, 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=200&count=200': {
            data: (0, responses_1.sfccSearchResult)(300, 200, 1, 'Hit')
        }, 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000': {
            // TODO: needs auth
            data: responses_1.sfccCustomerGroups
        } }),
    post: {
        'https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials': {
            data: {
                access_token: 'token',
                scope: 'mail tenantFilter profile',
                token_type: 'Bearer',
                expires_in: 1799
            }
        }
    }
};
describe('sfcc integration', function () {
    let sfccCodec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
        (0, rest_mock_1.massMock)(axios_1.default, requests, sfccRequests);
        sfccCodec = new _1.SFCCCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield sfccCodec.init(new _1.default());
    }));
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProduct({
            id: 'ExampleID'
        });
        expect(requests).toEqual([
            (0, requests_1.productIdRequest)('ExampleID')
        ]);
        expect(result).toEqual((0, results_1.exampleProduct)('ExampleID'));
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProducts({
            productIds: 'ExampleID,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productIdRequest)('ExampleID'),
            (0, requests_1.productIdRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('ExampleID'),
            (0, results_1.exampleProduct)('ExampleID2')
        ]);
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield sfccCodec.getProducts({
            keyword: 'Hit'
        });
        expect(requests).toEqual([
            (0, requests_1.keywordSearch)(0),
            (0, requests_1.keywordSearch)(200),
            ...(0, requests_1.productIdRequests)('Hit', 300)
        ]);
        expect(products.length).toEqual(300);
        expect(products).toEqual(Array.from({ length: 300 }).map((_, index) => (0, results_1.exampleProduct)('Hit' + index)));
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield sfccCodec.getProducts({ category: {
                children: [],
                products: [],
                id: 'newarrivals-womens',
                name: 'Womens',
                slug: 'newarrivals-womens',
            } });
        expect(requests).toEqual([
            (0, requests_1.categorySearch)(0),
            (0, requests_1.categorySearch)(200),
            ...(0, requests_1.productIdRequests)('Hit', 300)
        ]);
        expect(products.length).toEqual(300);
        expect(products).toEqual(Array.from({ length: 300 }).map((_, index) => (0, results_1.exampleProduct)('Hit' + index)));
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProduct({
            id: 'MissingID'
        });
        expect(result).toBeNull();
        expect(requests).toEqual([
            (0, requests_1.productIdRequest)('MissingID')
        ]);
    }));
    test('getProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProducts({
            productIds: 'ExampleID,NotHere,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productIdRequest)('ExampleID'),
            (0, requests_1.productIdRequest)('NotHere'),
            (0, requests_1.productIdRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, results_1.exampleProduct)('ExampleID'),
            null,
            (0, results_1.exampleProduct)('ExampleID2')
        ]);
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getRawProducts({
            productIds: 'ExampleID'
        });
        expect(requests).toEqual([
            (0, requests_1.productIdRequest)('ExampleID')
        ]);
        expect(result).toEqual([(0, responses_1.sfccProduct)('ExampleID')]);
    }));
    test('getRawProducts (one missing)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getRawProducts({
            productIds: 'ExampleID,NotHere,ExampleID2'
        });
        expect(requests).toEqual([
            (0, requests_1.productIdRequest)('ExampleID'),
            (0, requests_1.productIdRequest)('NotHere'),
            (0, requests_1.productIdRequest)('ExampleID2')
        ]);
        expect(result).toEqual([
            (0, responses_1.sfccProduct)('ExampleID'),
            null,
            (0, responses_1.sfccProduct)('ExampleID2')
        ]);
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        const category = yield sfccCodec.getCategory({ slug: 'newarrivals-womens' });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            (0, requests_1.categorySearch)(0),
            (0, requests_1.categorySearch)(200),
            ...(0, requests_1.productIdRequests)('Hit', 300)
        ]);
        expect(category.products.length).toEqual(300);
        expect(category).toEqual({
            children: [],
            products: Array.from({ length: 300 }).map((_, index) => (0, results_1.exampleProduct)('Hit' + index)),
            id: 'newarrivals-womens',
            name: 'Womens',
            slug: 'newarrivals-womens',
        });
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        const megaMenu = yield sfccCodec.getMegaMenu({});
        expect(requests).toEqual([
            requests_1.categoryRequest,
        ]);
        expect(megaMenu).toEqual(results_1.exampleMegaMenu);
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        const customerGroups = yield sfccCodec.getCustomerGroups({});
        expect(customerGroups).toEqual(results_1.exampleCustomerGroups);
        expect(requests).toEqual([
            requests_1.oauthRequest,
            requests_1.customerGroupsRequest
        ]);
    }));
});
