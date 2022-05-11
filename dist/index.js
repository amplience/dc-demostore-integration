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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceAPI = exports.API = exports.sleep = exports.getContentTypeSchema = exports.getContentType = exports.flattenCategories = exports.OAuthRestClient = exports.CryptKeeper = exports.getConfig = exports.getDemoStoreConfig = exports.getCommerceAPI = exports.middleware = exports.isServer = void 0;
const crypt_keeper_1 = __importDefault(require("./common/crypt-keeper"));
exports.CryptKeeper = crypt_keeper_1.default;
const rest_client_1 = __importDefault(require("./common/rest-client"));
exports.OAuthRestClient = rest_client_1.default;
const common_1 = require("./codec/codecs/common");
Object.defineProperty(exports, "flattenCategories", { enumerable: true, get: function () { return common_1.flattenCategories; } });
Object.defineProperty(exports, "getContentType", { enumerable: true, get: function () { return common_1.getContentType; } });
Object.defineProperty(exports, "getContentTypeSchema", { enumerable: true, get: function () { return common_1.getContentTypeSchema; } });
const api_1 = __importStar(require("./middleware/api"));
exports.middleware = api_1.default;
Object.defineProperty(exports, "getCommerceAPI", { enumerable: true, get: function () { return api_1.getCommerceAPI; } });
const amplience_1 = require("./amplience");
Object.defineProperty(exports, "getDemoStoreConfig", { enumerable: true, get: function () { return amplience_1.getDemoStoreConfig; } });
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return amplience_1.getDemoStoreConfig; } });
const util_1 = require("./util");
Object.defineProperty(exports, "isServer", { enumerable: true, get: function () { return util_1.isServer; } });
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return util_1.sleep; } });
__exportStar(require("./types"), exports);
__exportStar(require("./codec"), exports);
__exportStar(require("./common/paginator"), exports);
class API {
}
exports.API = API;
class CommerceAPI extends API {
}
exports.CommerceAPI = CommerceAPI;
