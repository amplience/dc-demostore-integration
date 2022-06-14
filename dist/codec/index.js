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
exports.getCodec = exports.registerCodec = exports.getCodecs = void 0;
const lodash_1 = __importDefault(require("lodash"));
const codecs = [];
const getCodecs = () => {
    return codecs;
};
exports.getCodecs = getCodecs;
const registerCodec = (codec) => {
    // console.log(`[ demostore ] register codec ${codec.SchemaURI}`)
    if (!codecs.includes(codec)) {
        codecs.push(codec);
    }
};
exports.registerCodec = registerCodec;
const apis = new Map();
const getCodec = (config) => __awaiter(void 0, void 0, void 0, function* () {
    let codecsMatchingConfig = (0, exports.getCodecs)().filter(c => lodash_1.default.difference(Object.keys(c.schema.properties), Object.keys(config)).length === 0);
    if (codecsMatchingConfig.length === 0) {
        throw `[ demostore ] no codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    else if (codecsMatchingConfig.length > 1) {
        throw `[ demostore ] multiple codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    let configHash = lodash_1.default.values(config).join('');
    if (!apis[configHash]) {
        let codec = lodash_1.default.first(codecsMatchingConfig);
        console.log(`[ demostore ] creating codec: ${codec.schema.uri}...`);
        let api = yield codec.getAPI(config);
        apis[configHash] = lodash_1.default.zipObject(Object.keys(api), Object.keys(api).filter(key => typeof api[key] === 'function').map((key) => {
            // apply default arguments for those not provided in the query
            return (args) => __awaiter(void 0, void 0, void 0, function* () {
                return yield api[key](Object.assign({ locale: 'en-US', language: 'en', country: 'US', currency: 'USD', segment: '' }, args));
            });
        }));
    }
    return apis[configHash];
});
exports.getCodec = getCodec;
(0, exports.registerCodec)(require('./codecs/bigcommerce').default);
(0, exports.registerCodec)(require('./codecs/commercetools').default);
(0, exports.registerCodec)(require('./codecs/sfcc').default);
(0, exports.registerCodec)(require('./codecs/elasticpath').default);
(0, exports.registerCodec)(require('./codecs/rest').default);
(0, exports.registerCodec)(require('./codecs/fabric').default);
(0, exports.registerCodec)(require('./codecs/hybris').default);
