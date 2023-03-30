"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptKeeper = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const rot47_1 = __importDefault(require("rot47"));
const lodash_1 = __importDefault(require("lodash"));
/**
 * Reverses a string.
 * @param str The string
 * @returns The reverse of the input string
 */
const reverseString = str => str.split('').reverse().join('');
/**
 * Cryptography helper methods with a hash based off of config delivery ID and hub ID.
 * @param config Codec config with _meta.deliveryId
 * @param hub Hub ID string
 * @returns Encryption methods
 */
const CryptKeeper = (config, hub) => {
    const hash = `${reverseString(lodash_1.default.last(config._meta.deliveryId.split('-')))}${hub}${lodash_1.default.last(config._meta.schema.split('/'))}${reverseString(lodash_1.default.first(config._meta.deliveryId.split('-')))}`;
    /**
     * Encrypt a string with AES using the generated hash.
     * @param text
     * @returns
     */
    const encryptAES = (text) => crypto_js_1.default.AES.encrypt(text, hash).toString();
    /**
     * Decrypt a string with AES using the generated hash.
     * @param text
     * @returns
     */
    const decryptAES = (text) => crypto_js_1.default.AES.decrypt(text, hash).toString(crypto_js_1.default.enc.Utf8);
    /**
     * Encrypt a string using the generated hash and some additional transforms.
     * @param text
     * @returns
     */
    const encrypt = (text) => text.startsWith('===') && text.endsWith('===') ? text : `===${(0, rot47_1.default)(reverseString(encryptAES(text)))}===`;
    /**
     * Decrypt a string using the generated hash and some additional transforms.
     * @param text
     * @returns
     */
    const decrypt = (text) => text.startsWith('===') && text.endsWith('===') ? decryptAES(reverseString((0, rot47_1.default)(text.substring(3, text.length - 3)))) : text;
    return {
        encrypt,
        decrypt,
        decryptAll: () => {
            lodash_1.default.each(config, (value, key) => {
                if (typeof value === 'string') {
                    config[key] = decrypt(value);
                }
            });
            return config;
        }
    };
};
exports.CryptKeeper = CryptKeeper;
