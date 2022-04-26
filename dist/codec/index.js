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
exports.getCodec = exports.registerCodec = void 0;
const lodash_1 = __importDefault(require("lodash"));
const codecs = {};
const registerCodec = (codec) => {
    // console.log(`[ aria ] register codec ${codec.SchemaURI}`)
    codecs[codec.SchemaURI] = codec;
};
exports.registerCodec = registerCodec;
const getCodec = (config) => {
    var _a;
    let codec = codecs[(_a = config === null || config === void 0 ? void 0 : config._meta) === null || _a === void 0 ? void 0 : _a.schema] || lodash_1.default.find(Object.values(codecs), c => c.canUseConfiguration(config));
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    let api = codec.getAPI(config);
    lodash_1.default.each(api, (method, key) => {
        // apply default arguments for those not provided in the query
        api[key] = (args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield method(Object.assign({ locale: 'en-US', language: 'en', country: 'US', currency: 'USD', segment: '' }, args));
        });
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
