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
exports.getCommerceAPIFromConfig = exports.getCommerceAPI = exports.getConfig = exports.CommerceAPI = exports.API = exports.flattenCategories = exports.OAuthRestClient = exports.CryptKeeper = exports.getResponse = exports.middleware = exports.isServer = void 0;
const amplience_1 = require("./amplience");
const codec_1 = require("./codec");
const crypt_keeper_1 = __importDefault(require("./common/crypt-keeper"));
exports.CryptKeeper = crypt_keeper_1.default;
const rest_client_1 = __importDefault(require("./common/rest-client"));
exports.OAuthRestClient = rest_client_1.default;
const common_1 = require("./codec/codecs/common");
Object.defineProperty(exports, "flattenCategories", { enumerable: true, get: function () { return common_1.flattenCategories; } });
const api_1 = __importStar(require("./middleware/api"));
exports.middleware = api_1.default;
Object.defineProperty(exports, "getResponse", { enumerable: true, get: function () { return api_1.getResponse; } });
const util_1 = require("./util");
Object.defineProperty(exports, "isServer", { enumerable: true, get: function () { return util_1.isServer; } });
__exportStar(require("./types"), exports);
__exportStar(require("./codec"), exports);
__exportStar(require("./common/paginator"), exports);
class API {
}
exports.API = API;
class CommerceAPI extends API {
}
exports.CommerceAPI = CommerceAPI;
const getConfig = (configLocator) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new amplience_1.AmplienceClient(configLocator).getConfig();
});
exports.getConfig = getConfig;
const getCommerceAPI = (config) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof config === 'string') {
        let demostoreConfig = yield (0, exports.getConfig)(config);
        return yield (0, exports.getCommerceAPIFromConfig)(demostoreConfig.commerce);
    }
    else {
        if ('config_locator' in config && config.config_locator) {
            let demostoreConfig = yield (0, exports.getConfig)(config.config_locator);
            return yield (0, exports.getCommerceAPIFromConfig)(demostoreConfig.commerce);
        }
        else if ('_meta' in config) {
            return yield (0, codec_1.getCodec)(config);
        }
    }
});
exports.getCommerceAPI = getCommerceAPI;
const getCommerceAPIFromConfig = (config) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, codec_1.getCodec)(config);
});
exports.getCommerceAPIFromConfig = getCommerceAPIFromConfig;
