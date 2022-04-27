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
    // console.log(`[ aria ] register codec ${codec.SchemaURI}`)
    if (!codecs.includes(codec)) {
        codecs.push(codec);
    }
};
exports.registerCodec = registerCodec;
const getCodec = (config) => {
    // let codec: Codec = codecs[config?._meta?.schema] || _.find(Object.values(codecs), c => c.canUseConfiguration(config))
    let codec = lodash_1.default.find(codecs, c => !!c.getAPI(config));
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    let api = codec.getAPI(config);
    lodash_1.default.each(api, (method, key) => {
        if (typeof api[key] === 'function') {
            // apply default arguments for those not provided in the query
            api[key] = (args) => __awaiter(void 0, void 0, void 0, function* () {
                return yield method(Object.assign({ locale: 'en-US', language: 'en', country: 'US', currency: 'USD', segment: '' }, args));
            });
        }
    });
    return api;
};
exports.getCodec = getCodec;
require("./codecs/bigcommerce");
require("./codecs/commercetools");
require("./codecs/sfcc");
require("./codecs/elasticpath");
require("./codecs/rest");
require("./codecs/fabric");
require("./codecs/hybris");
