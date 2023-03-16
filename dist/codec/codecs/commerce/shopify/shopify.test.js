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
const commerceSegmentsRequests = {
    post: {
        'https://site_id.myshopify.com/admin/api/version/graphql.json': {
            data: responses_1.shopifySegments
        }
    }
};
const commerceCollectionsRequests = {
    post: {
        'https://site_id.myshopify.com/api/version/graphql.json': {
            data: responses_1.shopifyCategories
        }
    }
};
describe('shopify integration', function () {
    let codec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
    }));
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getRawProducts (multiple, one missing)', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        (0, rest_mock_1.massMock)(axios_1.default, requests, commerceCollectionsRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        const categories = yield codec.getMegaMenu({});
        expect(categories).toEqual(results_1.exampleMegaMenu);
        expect(requests).toEqual([
            requests_1.collectionsRequest
        ]);
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        (0, rest_mock_1.massMock)(axios_1.default, requests, commerceSegmentsRequests);
        codec = new _1.ShopifyCommerceCodec((0, util_1.flattenConfig)(config_1.config));
        yield codec.init(new _1.default());
        const customerGroups = yield codec.getCustomerGroups({});
        expect(customerGroups).toEqual(results_1.exampleCustomerGroups);
        expect(requests).toEqual([
            requests_1.segmentsRequest
        ]);
    }));
});
