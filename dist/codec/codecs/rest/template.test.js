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
jest.mock('axios');
const sfccRequests = {
    get: {}
};
const config = {
    vendor: '...',
    api_url: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
    auth_url: 'https://account.demandware.com/dwsso/oauth2/access_token',
    client_id: 'test-client',
    client_secret: 'test-secret',
    site_id: 'TestSite'
};
const oauthRequest = {
    config: {
        url: "https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials"
    },
    url: "https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials"
};
const productIdRequest = (id) => ({
// Returns request made to fetch a given product ID
});
const productIdRequests = (id, total) => Array.from({ length: total }).map((_, index) => productIdRequest(id + index));
const exampleProduct = (id) => ({
// Common representation of the product
});
const rawProduct = (id) => ({
// Codec specific representation of the product
});
describe('sfcc integration', function () {
    let codec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
        (0, rest_mock_1.massMock)(axios_1.default, requests, sfccRequests);
        codec = new _1.RestCommerceCodec(config);
        yield codec.init(new _1.default());
    }));
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProduct({
            id: 'ExampleID'
        });
        expect(requests).toEqual([
            oauthRequest,
            productIdRequest('ExampleID')
        ]);
        expect(result).toEqual(exampleProduct('ExampleID'));
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            productIds: 'ExampleID,ExampleID2'
        });
        expect(requests).toEqual([
            oauthRequest,
            productIdRequest('ExampleID'),
            productIdRequest('ExampleID2')
        ]);
        expect(result).toEqual([
            exampleProduct('ExampleID'),
            exampleProduct('ExampleID2')
        ]);
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            keyword: 'Hit'
        });
        expect(requests).toEqual([
            oauthRequest,
            productIdRequest('ExampleID'),
            productIdRequest('ExampleID2')
        ]);
        expect(result).toEqual([
            exampleProduct('ExampleID'),
            exampleProduct('ExampleID2')
        ]);
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield codec.getProducts({ category: {
                children: [],
                products: [],
                id: "newarrivals-womens",
                name: "Womens",
                slug: "newarrivals-womens",
            } });
        expect(requests).toEqual([
            oauthRequest,
            productIdRequests('Hit', 300)
        ]);
        expect(products.length).toEqual(300);
        expect(products).toEqual(Array.from({ length: 300 }).map((_, index) => exampleProduct('Hit' + index)));
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        expect(codec.getProduct({
            id: 'MissingID'
        })).rejects.toMatchInlineSnapshot();
        expect(requests).toEqual([
            oauthRequest,
            productIdRequest('MissingID')
        ]);
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getRawProducts({
            productIds: 'ExampleID'
        });
        expect(requests).toEqual([
            oauthRequest,
            productIdRequest('ExampleID')
        ]);
        expect(result).toEqual([rawProduct('ExampleID')]);
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        const category = yield codec.getCategory({ slug: 'newarrivals-womens' });
        expect(requests).toEqual([
            oauthRequest,
            productIdRequests('Hit', 300)
        ]);
        expect(category.products.length).toEqual(300);
        expect(category).toEqual({
            children: [],
            products: Array.from({ length: 300 }).map((_, index) => exampleProduct('Hit' + index)),
            id: "newarrivals-womens",
            name: "Womens",
            slug: "newarrivals-womens",
        });
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        const megaMenu = yield codec.getMegaMenu({});
        expect(requests).toEqual([
            oauthRequest,
        ]);
        expect(megaMenu).toMatchInlineSnapshot();
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        const customerGroups = yield codec.getCustomerGroups({});
        expect(customerGroups).toMatchInlineSnapshot();
        expect(requests).toEqual([
            oauthRequest
        ]);
    }));
});
