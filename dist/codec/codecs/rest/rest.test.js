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
const config_1 = require("./test/config");
const responses_1 = require("./test/responses");
const requests_1 = require("./test/requests");
jest.mock('axios');
const restRequests = {
    get: {
        [config_1.config.categoryURL]: {
            data: responses_1.categories
        },
        [config_1.config.productURL]: {
            data: responses_1.products
        },
        [config_1.config.customerGroupURL]: {
            data: responses_1.groups
        },
        [config_1.config.translationsURL]: {
            data: []
        },
    }
};
describe('rest integration', function () {
    let codec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
        (0, rest_mock_1.massMock)(axios_1.default, requests, restRequests);
        codec = new _1.RestCommerceCodec(config_1.config);
        yield codec.init(new _1.default());
    }));
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProduct({
            id: 'rootProduct'
        });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(result).toEqual((0, responses_1.restProduct)('rootProduct', 'A product in the root', responses_1.rootCategory));
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            productIds: 'rootProduct,catProduct1,cat2Product3'
        });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(result).toEqual([
            (0, responses_1.restProduct)('rootProduct', 'A product in the root', responses_1.rootCategory),
            (0, responses_1.restProduct)('catProduct1', 'A product in the first category', responses_1.childCategories[0]),
            (0, responses_1.restProduct)('cat2Product3', 'A third product in the second category', responses_1.childCategories[1])
        ]);
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getProducts({
            keyword: 'second product'
        });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(result).toEqual([
            (0, responses_1.restProduct)('catProduct2', 'A second product in the first category', responses_1.childCategories[0]),
            (0, responses_1.restProduct)('cat2Product2', 'A second product in the second category', responses_1.childCategories[1])
        ]);
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield codec.getProducts({ category: responses_1.childCategories[1] });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(products).toEqual([
            (0, responses_1.restProduct)('cat2Product1', 'A product in the second category', responses_1.childCategories[1]),
            (0, responses_1.restProduct)('cat2Product2', 'A second product in the second category', responses_1.childCategories[1]),
            (0, responses_1.restProduct)('cat2Product3', 'A third product in the second category', responses_1.childCategories[1])
        ]);
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(codec.getProduct({
            id: 'MissingID'
        })).resolves.toBeUndefined();
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield codec.getRawProducts({
            productIds: 'rootProduct'
        });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(result).toEqual([]);
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        const category = yield codec.getCategory({ slug: 'child1-cat' });
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(category).toEqual(responses_1.childCategories[0]);
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        const megaMenu = yield codec.getMegaMenu({});
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(megaMenu).toEqual([responses_1.rootCategory]);
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        const customerGroups = yield codec.getCustomerGroups({});
        expect(requests).toEqual([
            requests_1.categoryRequest,
            requests_1.productRequest,
            requests_1.customerGroupRequest,
            requests_1.translationsRequest
        ]);
        expect(customerGroups).toEqual(responses_1.groups);
    }));
});
