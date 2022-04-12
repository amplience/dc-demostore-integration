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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.getCommerceAPIFromConfig = exports.getCommerceAPI = exports.getConfig = exports.CommerceAPI = exports.flattenCategories = exports.OAuthRestClient = exports.CryptKeeper = void 0;
const amplience_1 = require("./amplience");
const codec_1 = require("./codec");
const crypt_keeper_1 = __importDefault(require("./common/crypt-keeper"));
exports.CryptKeeper = crypt_keeper_1.default;
const rest_client_1 = __importDefault(require("./common/rest-client"));
exports.OAuthRestClient = rest_client_1.default;
const common_1 = require("./codec/codecs/common");
Object.defineProperty(exports, "flattenCategories", { enumerable: true, get: function () { return common_1.flattenCategories; } });
__exportStar(require("./types"), exports);
__exportStar(require("./codec"), exports);
__exportStar(require("./common/paginator"), exports);
class CommerceAPI {
}
exports.CommerceAPI = CommerceAPI;
const getConfig = (configLocator) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new amplience_1.AmplienceClient(configLocator).getConfig();
});
exports.getConfig = getConfig;
const getCommerceAPI = (configLocator) => __awaiter(void 0, void 0, void 0, function* () {
    let demostoreConfig = yield (0, exports.getConfig)(configLocator);
    let config = yield (0, codec_1.getCodec)(Object.assign(Object.assign({}, demostoreConfig.commerce), { locator: demostoreConfig.locator }));
    return config;
});
exports.getCommerceAPI = getCommerceAPI;
const getCommerceAPIFromConfig = (config) => __awaiter(void 0, void 0, void 0, function* () {
    let codec = yield (0, codec_1.getCodec)(Object.assign({}, config));
    return codec;
});
exports.getCommerceAPIFromConfig = getCommerceAPIFromConfig;
