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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodec = exports.registerCodec = exports.Codec = void 0;
class Codec {
    getAPI(config) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Codec = Codec;
const codecs = {};
const registerCodec = (codec) => {
    console.log(`[ aria ] register codec [ ${codec.SchemaURI} ]`);
    codecs[codec.SchemaURI] = codec;
};
exports.registerCodec = registerCodec;
const getCodec = (config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let codec = codecs[(_a = config === null || config === void 0 ? void 0 : config._meta) === null || _a === void 0 ? void 0 : _a.schema];
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`;
    }
    console.log(`[ aria ] use codec [ ${(_b = config === null || config === void 0 ? void 0 : config._meta) === null || _b === void 0 ? void 0 : _b.schema} ]`);
    return yield codec.getAPI(config);
});
exports.getCodec = getCodec;
require("./codecs/bigcommerce");
require("./codecs/commercetools");
require("./codecs/sfcc");
require("./codecs/elasticpath");
require("./codecs/rest");
