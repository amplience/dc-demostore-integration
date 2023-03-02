"use strict";
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
const axios_1 = __importDefault(require("axios"));
const pagination_1 = require("./pagination");
jest.mock('axios');
describe('getPageByQuery', function () {
    test('gets function with string total and result prop map', () => __awaiter(this, void 0, void 0, function* () {
        const sampleData = ['example', 'data'];
        const client = {
            get: jest.fn().mockImplementation(() => Promise.resolve({
                result: sampleData,
                number: sampleData.length
            }))
        };
        const getPage = (0, pagination_1.getPageByQuery)('offset', 'count', 'number', 'result');
        const withClient = yield getPage(client, 'https://testMethod', { param1: 1, param2: 2 });
        const result = yield withClient(0, 20);
        yield withClient(2, 20);
        expect(client.get).toHaveBeenNthCalledWith(1, { url: 'https://testmethod/?param1=1&param2=2&offset=0&count=20' });
        expect(client.get).toHaveBeenNthCalledWith(2, { url: 'https://testmethod/?param1=1&param2=2&offset=40&count=20' });
        expect(result).toEqual({
            data: sampleData,
            total: sampleData.length
        });
    }));
    test('gets function with function total and result prop map, different query', () => __awaiter(this, void 0, void 0, function* () {
        const sampleData = ['example', 'data'];
        const client = {
            get: jest.fn().mockImplementation(() => Promise.resolve({
                result: {
                    edges: sampleData
                },
                number: {
                    total: sampleData.length
                }
            }))
        };
        const getPage = (0, pagination_1.getPageByQuery)('start', 'size', (obj) => obj.number.total, (obj) => obj.result.edges);
        const withClient = yield getPage(client, 'https://testMethod', { param0: 1, start: 2 });
        const result = yield withClient(0, 20);
        yield withClient(2, 20);
        expect(client.get).toHaveBeenNthCalledWith(1, { url: 'https://testmethod/?param0=1&start=0&size=20' });
        expect(client.get).toHaveBeenNthCalledWith(2, { url: 'https://testmethod/?param0=1&start=40&size=20' });
        expect(result).toEqual({
            data: sampleData,
            total: sampleData.length
        });
    }));
});
describe('getPageByQueryAxios', function () {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test('gets function with string total and result prop map', () => __awaiter(this, void 0, void 0, function* () {
        const sampleData = ['example', 'data'];
        const mockAxiosGet = axios_1.default.get;
        mockAxiosGet.mockImplementation(() => Promise.resolve({
            data: {
                result: sampleData,
                number: sampleData.length
            }
        }));
        const config = { example: 'config' };
        const getPage = (0, pagination_1.getPageByQueryAxios)('offset', 'count', 'number', 'result');
        const withClient = yield getPage(axios_1.default, 'https://testMethod', config, { param1: 1, param2: 2 });
        const result = yield withClient(0, 20);
        yield withClient(2, 20);
        expect(axios_1.default.get).toHaveBeenNthCalledWith(1, 'https://testmethod/?param1=1&param2=2&offset=0&count=20', config);
        expect(axios_1.default.get).toHaveBeenNthCalledWith(2, 'https://testmethod/?param1=1&param2=2&offset=40&count=20', config);
        expect(result).toEqual({
            data: sampleData,
            total: sampleData.length
        });
    }));
    test('gets function with function total and result prop map, different query', () => __awaiter(this, void 0, void 0, function* () {
        const sampleData = ['example', 'data'];
        const mockAxiosGet = axios_1.default.get;
        mockAxiosGet.mockImplementation(() => Promise.resolve({
            data: {
                result: {
                    edges: sampleData
                },
                number: {
                    total: sampleData.length
                }
            }
        }));
        const config = { example: 'config' };
        const getPage = (0, pagination_1.getPageByQueryAxios)('start', 'size', (obj) => obj.number.total, (obj) => obj.result.edges);
        const withClient = yield getPage(axios_1.default, 'https://testMethod', config, { param0: 1, start: 2 });
        const result = yield withClient(0, 20);
        yield withClient(2, 20);
        expect(axios_1.default.get).toHaveBeenNthCalledWith(1, 'https://testmethod/?param0=1&start=0&size=20', config);
        expect(axios_1.default.get).toHaveBeenNthCalledWith(2, 'https://testmethod/?param0=1&start=40&size=20', config);
        expect(result).toEqual({
            data: sampleData,
            total: sampleData.length
        });
    }));
});
describe('paginate', function () {
    const getPageMock = (total) => (page, pageSize) => {
        const pageBase = page * pageSize;
        const remaining = Math.max(0, total - pageBase);
        return Promise.resolve({ data: Array.from({ length: Math.min(pageSize, remaining) }).map((_, index) => index + pageBase), total });
    };
    test('paginate 0 items', () => __awaiter(this, void 0, void 0, function* () {
        const getPage = jest.fn().mockImplementation(() => Promise.resolve({ data: [], total: 0 }));
        const result = yield (0, pagination_1.paginate)(getPage, 20, 0);
        expect(getPage).toHaveBeenCalledWith(0, 20);
        expect(result).toEqual([]);
    }));
    test('paginate 1 item', () => __awaiter(this, void 0, void 0, function* () {
        const getPage = jest.fn().mockImplementation(() => Promise.resolve({ data: [1], total: 1 }));
        const result = yield (0, pagination_1.paginate)(getPage, 20, 0);
        expect(getPage).toHaveBeenCalledWith(0, 20);
        expect(result).toEqual([1]);
    }));
    test('paginate 2 pages', () => __awaiter(this, void 0, void 0, function* () {
        const total = 30;
        const getPage = jest.fn().mockImplementation((page, pageSize) => {
            const pageBase = page * pageSize;
            const remaining = Math.max(0, total - pageBase);
            return Promise.resolve({ data: Array.from({ length: Math.min(pageSize, remaining) }).map((_, index) => index + pageBase), total });
        });
        const result = yield (0, pagination_1.paginate)(getPage, 20, 0);
        expect(getPage).toHaveBeenCalledWith(0, 20);
        expect(getPage).toHaveBeenCalledWith(1, 20);
        expect(result).toEqual(Array.from({ length: total }).map((_, index) => index));
    }));
    test('paginate 20 pages', () => __awaiter(this, void 0, void 0, function* () {
        const total = 390;
        const getPage = jest.fn().mockImplementation(getPageMock(total));
        const result = yield (0, pagination_1.paginate)(getPage, 20, 0);
        for (let i = 0; i < 20; i++) {
            expect(getPage).toHaveBeenCalledWith(i, 20);
        }
        expect(result).toEqual(Array.from({ length: total }).map((_, index) => index));
    }));
    test('paginate 10 items from last page', () => __awaiter(this, void 0, void 0, function* () {
        const total = 390;
        const getPage = jest.fn().mockImplementation(getPageMock(total));
        const result = yield (0, pagination_1.paginate)(getPage, 20, 19, 1);
        expect(getPage).toHaveBeenCalledWith(19, 20);
        expect(result).toEqual(Array.from({ length: 10 }).map((_, index) => index + 380));
    }));
    test('paginate page 10-20 of 30', () => __awaiter(this, void 0, void 0, function* () {
        const total = 600;
        const getPage = jest.fn().mockImplementation(getPageMock(total));
        const result = yield (0, pagination_1.paginate)(getPage, 20, 10, 10);
        for (let i = 10; i < 20; i++) {
            expect(getPage).toHaveBeenCalledWith(i, 20);
        }
        expect(result).toEqual(Array.from({ length: 200 }).map((_, index) => index + 200));
    }));
});
