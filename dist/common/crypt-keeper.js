"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const rot47_1 = __importDefault(require("rot47"));
const lodash_1 = __importDefault(require("lodash"));
const reverseString = str => str.split("").reverse().join("");
const CryptKeeper = (config) => {
    const hash = `${reverseString(lodash_1.default.last(config._meta.deliveryId.split('-')))}${lodash_1.default.first(config.locator.split(':'))}${lodash_1.default.last(config._meta.schema.split('/'))}${reverseString(lodash_1.default.first(config._meta.deliveryId.split('-')))}`;
    const encryptAES = (text) => crypto_js_1.default.AES.encrypt(text, hash).toString();
    const decryptAES = (text) => {
        const bytes = crypto_js_1.default.AES.decrypt(text, hash);
        const originalText = bytes.toString(crypto_js_1.default.enc.Utf8);
        return originalText;
    };
    return {
        encrypt: (text) => {
            return text.startsWith('===') && text.endsWith('===') ? text : `===${(0, rot47_1.default)(reverseString(encryptAES(text)))}===`;
        },
        decrypt: (text) => {
            return text.startsWith('===') && text.endsWith('===') ? decryptAES(reverseString((0, rot47_1.default)(text.substring(3, text.length - 3)))) : text;
        }
    };
};
exports.default = CryptKeeper;
