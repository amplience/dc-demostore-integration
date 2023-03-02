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
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
describe('sleep', function () {
    test('sleeps for 500ms', () => __awaiter(this, void 0, void 0, function* () {
        const time = Date.now();
        yield (0, util_1.sleep)(500);
        // Should be more than 498ms
        expect(Date.now() - time).toBeGreaterThan(498);
    }));
    test('sleeps for 0ms', () => __awaiter(this, void 0, void 0, function* () {
        const time = Date.now();
        yield (0, util_1.sleep)(0);
        // Should be less than 3ms
        expect(Date.now() - time).toBeLessThan(3);
    }));
});
describe('formatMoneyString', function () {
    test('should format money based on locale and currency', () => {
        expect((0, util_1.formatMoneyString)('2.00', { locale: 'en-US' })).toEqual('$2.00');
        expect((0, util_1.formatMoneyString)('2.00', { locale: 'en-GB' })).toEqual('US$2.00');
        expect((0, util_1.formatMoneyString)('2.00', { locale: 'en-GB', currency: 'GBP' })).toEqual('£2.00');
        expect((0, util_1.formatMoneyString)('2.00', { locale: 'en-GB', currency: 'EUR' })).toEqual('€2.00');
        expect((0, util_1.formatMoneyString)('2.00', { locale: 'en-US', currency: 'GBP' })).toEqual('£2.00');
    });
    test('throws on invalid currency code', () => {
        expect(() => (0, util_1.formatMoneyString)('2.00', { locale: 'en-GB', currency: 'wrong' })).toThrow();
    });
});
describe('isServer', function () {
    test('true when window is undefined', () => {
        expect((0, util_1.isServer)()).toBeTruthy();
    });
    test('false when window is defined', () => {
        global.window = {};
        expect((0, util_1.isServer)()).toBeFalsy();
        delete global.window;
    });
});
describe('quote', function () {
    test('quotes a string', () => {
        expect((0, util_1.quote)('hello')).toEqual('"hello"');
        expect((0, util_1.quote)('another string')).toEqual('"another string"');
        expect((0, util_1.quote)('"')).toEqual('"""');
    });
    test('quotes the empty string', () => {
        expect((0, util_1.quote)('')).toEqual('""');
    });
});
describe('quoteProductIdString', function () {
    test('quotes one string', () => {
        expect((0, util_1.quoteProductIdString)('hello')).toEqual('"hello"');
        expect((0, util_1.quoteProductIdString)('another string')).toEqual('"another string"');
        expect((0, util_1.quoteProductIdString)('"')).toEqual('"""');
    });
    test('quotes many strings', () => {
        expect((0, util_1.quoteProductIdString)('comma,separated')).toEqual('"comma","separated"');
        expect((0, util_1.quoteProductIdString)('even,more,strings,here')).toEqual('"even","more","strings","here"');
    });
    test('quotes the empty string', () => {
        expect((0, util_1.quoteProductIdString)('')).toEqual('""');
    });
});
