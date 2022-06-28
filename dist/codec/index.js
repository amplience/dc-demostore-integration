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
exports.getCommerceCodec = exports.getCodec = exports.registerCodec = exports.getCodecs = exports.CodecType = void 0;
const util_1 = require("../common/util");
const lodash_1 = __importDefault(require("lodash"));
const errors_1 = require("../common/errors");
var CodecType;
(function (CodecType) {
    CodecType[CodecType["commerce"] = 0] = "commerce";
})(CodecType = exports.CodecType || (exports.CodecType = {}));
const codecs = new Map();
codecs[CodecType.commerce] = [];
// public interface
const getCodecs = (type) => {
    return codecs[type];
};
exports.getCodecs = getCodecs;
const registerCodec = (codec) => {
    if (!codecs[codec.metadata.type].includes(codec)) {
        codecs[codec.metadata.type].push(codec);
    }
};
exports.registerCodec = registerCodec;
// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map();
const getCodec = (config, type) => __awaiter(void 0, void 0, void 0, function* () {
    let codecsMatchingConfig = (0, exports.getCodecs)(type).filter(c => lodash_1.default.difference(Object.keys(c.metadata.properties), Object.keys(config)).length === 0);
    if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
        throw new errors_1.CodecNotFoundError(`[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(config, undefined, 4)}`);
    }
    let configHash = lodash_1.default.values(config).join('');
    if (!apis[configHash]) {
        let codec = lodash_1.default.first(codecsMatchingConfig);
        console.log(`[ demostore ] creating codec: ${codec.metadata.vendor}...`);
        let api = yield codec.getAPI(config);
        apis[configHash] = wrappedCommerceApi(api);
    }
    return apis[configHash];
});
exports.getCodec = getCodec;
const defaultArgs = (args) => (Object.assign({ locale: 'en-US', language: 'en', country: 'US', currency: 'USD', segment: '' }, args));
const wrappedCommerceApi = (api) => __awaiter(void 0, void 0, void 0, function* () {
    // cache the mega menu
    let megaMenu = yield api.getMegaMenu(defaultArgs({}));
    let flattenedCategories = [];
    const bulldozeCategories = cat => {
        flattenedCategories.push(cat);
        cat.children && cat.children.forEach(bulldozeCategories);
    };
    megaMenu.forEach(bulldozeCategories);
    const findCategory = (slug) => {
        return flattenedCategories.find(category => { var _a; return ((_a = category.slug) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (slug === null || slug === void 0 ? void 0 : slug.toLowerCase()); });
    };
    let wrapped = {
        getProduct: (args) => __awaiter(void 0, void 0, void 0, function* () {
            // current thinking: point to wrapped.getProducts() as getProduct() is really a subset of getProducts()
            return lodash_1.default.first(yield wrapped.getProducts(Object.assign(Object.assign({}, args), { productIds: args.id })));
        }),
        getProducts: (args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield api.getProducts(defaultArgs(args));
        }),
        getCategory: (args) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let category = findCategory(args.slug);
            if (category) {
                // populate products into category
                category.products = ((_a = category.products) === null || _a === void 0 ? void 0 : _a.length) > 0 ? category.products : yield wrapped.getProducts({ category });
            }
            return category;
        }),
        getMegaMenu: (args) => __awaiter(void 0, void 0, void 0, function* () {
            return megaMenu;
        }),
        getCustomerGroups: (args) => __awaiter(void 0, void 0, void 0, function* () {
            // pass through
            return yield api.getCustomerGroups(defaultArgs(args));
        })
    };
    return wrapped;
});
const getCommerceCodec = (config) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.getCodec)(config, CodecType.commerce); });
exports.getCommerceCodec = getCommerceCodec;
// end public interface
// register codecs
if ((0, util_1.isServer)()) {
    Promise.resolve().then(() => __importStar(require('./codecs/akeneo')));
    Promise.resolve().then(() => __importStar(require('./codecs/bigcommerce')));
    Promise.resolve().then(() => __importStar(require('./codecs/commercetools')));
    Promise.resolve().then(() => __importStar(require('./codecs/constructor.io')));
    Promise.resolve().then(() => __importStar(require('./codecs/elasticpath')));
    Promise.resolve().then(() => __importStar(require('./codecs/fabric')));
    Promise.resolve().then(() => __importStar(require('./codecs/hybris')));
    Promise.resolve().then(() => __importStar(require('./codecs/rest')));
    Promise.resolve().then(() => __importStar(require('./codecs/sfcc')));
}
// reexport codec common functions
__exportStar(require("./codecs/common"), exports);
