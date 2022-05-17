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
exports.getCommerceCodec = exports.getCodec = exports.registerCodec = exports.getCodecs = exports.CodecType = void 0;
const lodash_1 = __importDefault(require("lodash"));
var CodecType;
(function (CodecType) {
    CodecType[CodecType["commerce"] = 0] = "commerce";
})(CodecType = exports.CodecType || (exports.CodecType = {}));
const codecs = new Map();
codecs[CodecType.commerce] = [];
const getCodecs = (type) => {
    return codecs[type];
};
exports.getCodecs = getCodecs;
const registerCodec = (codec) => {
    // console.log(`[ demostore ] register [ ${codec.schema.type} ] codec ${codec.schema.uri}`)
    if (!codecs[codec.schema.type].includes(codec)) {
        codecs[codec.schema.type].push(codec);
    }
};
exports.registerCodec = registerCodec;
// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map();
const getCodec = (config, type) => __awaiter(void 0, void 0, void 0, function* () {
    let codecsMatchingConfig = (0, exports.getCodecs)(type).filter(c => lodash_1.default.difference(Object.keys(c.schema.properties), Object.keys(config)).length === 0);
    if (codecsMatchingConfig.length === 0) {
        throw `[ demostore ] no codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    else if (codecsMatchingConfig.length > 1) {
        throw `[ demostore ] multiple codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    if (!apis[config]) {
        let codec = lodash_1.default.first(codecsMatchingConfig);
        let api = yield codec.getAPI(config);
        lodash_1.default.each(api, (method, key) => {
            if (typeof api[key] === 'function') {
                // apply default arguments for those not provided in the query
                api[key] = (args) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield method(Object.assign({ locale: 'en-US', language: 'en', country: 'US', currency: 'USD', segment: '' }, args));
                });
            }
        });
        apis[config] = api;
    }
    return apis[config];
});
exports.getCodec = getCodec;
const getCommerceCodec = (config) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.getCodec)(config, CodecType.commerce);
});
exports.getCommerceCodec = getCommerceCodec;
(0, exports.registerCodec)(require('./codecs/bigcommerce').default);
(0, exports.registerCodec)(require('./codecs/commercetools').default);
(0, exports.registerCodec)(require('./codecs/sfcc').default);
(0, exports.registerCodec)(require('./codecs/elasticpath').default);
(0, exports.registerCodec)(require('./codecs/rest').default);
(0, exports.registerCodec)(require('./codecs/fabric').default);
(0, exports.registerCodec)(require('./codecs/hybris').default);
