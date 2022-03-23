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
const nanoid_1 = require("nanoid");
const util_1 = require("../util");
class Codec {
    constructor(config) {
        this.codecId = (0, nanoid_1.nanoid)(8);
        this.config = config;
    }
}
exports.Codec = Codec;
const codecTypes = {};
const cachedCodecs = {};
const registerCodec = (codec) => {
    console.log(`[ aria ] register codec ${codec.SchemaURI}`);
    codecTypes[codec.SchemaURI] = codec;
};
exports.registerCodec = registerCodec;
let codecLoadingState = 0;
const getCodec = (config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (codecLoadingState === 0) { // not loaded
        codecLoadingState = 1;
        (0, exports.registerCodec)(yield (yield Promise.resolve().then(() => __importStar(require('./codecs/rest')))).default);
        (0, exports.registerCodec)(yield (yield Promise.resolve().then(() => __importStar(require('./codecs/commercetools')))).default);
        (0, exports.registerCodec)(yield (yield Promise.resolve().then(() => __importStar(require('./codecs/elasticpath')))).default);
        (0, exports.registerCodec)(yield (yield Promise.resolve().then(() => __importStar(require('./codecs/fabric')))).default);
        codecLoadingState = 2;
    }
    else if (codecLoadingState === 1) { // actively loading
        yield (0, util_1.sleep)(100);
        return yield (0, exports.getCodec)(config);
    }
    let deliveryId = ((_a = config === null || config === void 0 ? void 0 : config._meta) === null || _a === void 0 ? void 0 : _a.deliveryId) || '';
    if (!cachedCodecs[deliveryId]) {
        let codecGenerator = codecTypes[(_b = config === null || config === void 0 ? void 0 : config._meta) === null || _b === void 0 ? void 0 : _b.schema];
        if (!codecGenerator) {
            throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`;
        }
        console.log(`[ aria ] using codec for schema [ ${(_c = config === null || config === void 0 ? void 0 : config._meta) === null || _c === void 0 ? void 0 : _c.schema} ]`);
        cachedCodecs[deliveryId] = yield codecGenerator.getInstance(config);
    }
    return cachedCodecs[deliveryId];
});
exports.getCodec = getCodec;
