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
exports.getCommerceCodec = exports.getCodec = exports.registerCodec = exports.getCodecs = void 0;
const lodash_1 = __importDefault(require("lodash"));
const core_1 = require("./codecs/core");
const errors_1 = require("../common/errors");
const codecs = new Map();
codecs[core_1.CodecTypes.commerce] = [];
/**
 * Get all the codecs with a given type
 * @param type Codec type
 * @returns All registered codecs that match the type
 */
// public interface
const getCodecs = (type) => {
    return type ? codecs[type] : lodash_1.default.flatMap(codecs);
};
exports.getCodecs = getCodecs;
/**
 * Register a codec type object.
 * @param codec Codec type object
 */
const registerCodec = (codec) => {
    if (!codecs[codec.type].includes(codec)) {
        codecs[codec.type].push(codec);
    }
};
exports.registerCodec = registerCodec;
// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map();
/**
 * Mask sensitive data in an object.
 * Note: only affects fields called `client_secret`, `api_token`, `password`.
 * @param obj Object to copy with sensitive fields removed.
 * @returns The object with any sensitive fields removed.
 */
const maskSensitiveData = (obj) => {
    return Object.assign(Object.assign({}, obj), { client_secret: obj.client_secret && '**** redacted ****', api_token: obj.api_token && '**** redacted ****', password: obj.password && '**** redacted ****' });
};
/**
 * Get an API given a configuration object and a codec type.
 * It attempts to match a registered codec by the `vendor` property first, if present.
 * If not, it attempts to match based on the shape of the codec object.
 * @param config API configuration
 * @param type Type of codec to find
 * @returns A new API for the given configuration.
 */
const getCodec = (config, type) => __awaiter(void 0, void 0, void 0, function* () {
    const codecs = (0, exports.getCodecs)(type);
    let codec;
    // novadev-450: https://ampliencedev.atlassian.net/browse/NOVADEV-450
    if ('vendor' in config) {
        const vendorCodec = codecs.find(codec => codec.vendor === config.vendor);
        if (!vendorCodec) {
            throw new errors_1.IntegrationError({
                message: `codec not found for vendor [ ${config.vendor} ]`,
                helpUrl: 'https://help.dc-demostore.com/codec-error'
            });
        }
        // check that all required properties are there
        const difference = lodash_1.default.difference(Object.keys(vendorCodec.properties), Object.keys(config));
        if (difference.length > 0) {
            throw new errors_1.IntegrationError({
                message: `configuration missing properties required for vendor [ ${config.vendor} ]: [ ${difference.join(', ')} ]`,
                helpUrl: 'https://help.dc-demostore.com/codec-error'
            });
        }
        codec = vendorCodec;
    }
    // end novadev-450
    else {
        const codecsMatchingConfig = codecs.filter(c => lodash_1.default.difference(Object.keys(c.properties), Object.keys(config)).length === 0);
        if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
            throw new errors_1.IntegrationError({
                message: `[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(maskSensitiveData(config), undefined, 4)}`,
                helpUrl: 'https://help.dc-demostore.com/codec-error'
            });
        }
        codec = codecsMatchingConfig.pop();
    }
    const configHash = lodash_1.default.values(config).join('');
    console.log(`[ demostore ] creating codec: ${codec.vendor}...`);
    return apis[configHash] = apis[configHash] || (yield codec.getApi(config));
});
exports.getCodec = getCodec;
/**
 * Get a commerce API given a configuration object.
 * It attempts to match a registered codec by the `vendor` property first, if present.
 * If not, it attempts to match based on the shape of the codec object.
 * @param config Configuration object for the commerce API
 * @returns A new commerce API for the given configuration
 */
const getCommerceCodec = (config) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.getCodec)(config, core_1.CodecTypes.commerce); });
exports.getCommerceCodec = getCommerceCodec;
// end public interface
const commercetools_1 = __importDefault(require("./codecs/commercetools"));
(0, exports.registerCodec)(new commercetools_1.default());
const rest_1 = __importDefault(require("./codecs/rest"));
(0, exports.registerCodec)(new rest_1.default());
const sfcc_1 = __importDefault(require("./codecs/sfcc"));
(0, exports.registerCodec)(new sfcc_1.default());
const bigcommerce_1 = __importDefault(require("./codecs/bigcommerce"));
(0, exports.registerCodec)(new bigcommerce_1.default());
// reexport codec common functions
__exportStar(require("./codecs/common"), exports);
__exportStar(require("./codecs/core"), exports);
