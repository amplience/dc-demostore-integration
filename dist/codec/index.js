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
exports.getCommerceCodec = exports.defaultArgs = exports.getCodec = exports.registerCodec = exports.getCodecs = exports.getRandom = exports.CommerceCodec = exports.CodecTestOperationType = exports.CommerceCodecType = exports.CodecType = exports.CodecTypes = void 0;
const util_1 = require("../common/util");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("..");
var CodecTypes;
(function (CodecTypes) {
    CodecTypes[CodecTypes["commerce"] = 0] = "commerce";
})(CodecTypes = exports.CodecTypes || (exports.CodecTypes = {}));
class CodecType {
    get type() {
        return this._type;
    }
    get vendor() {
        return this._vendor;
    }
    get properties() {
        return this._properties;
    }
    getApi(config) {
        throw new Error('must implement getCodec');
    }
}
exports.CodecType = CodecType;
class CommerceCodecType extends CodecType {
    get type() {
        return CodecTypes.commerce;
    }
    getApi(config) {
        throw new Error('must implement getCodec');
    }
}
exports.CommerceCodecType = CommerceCodecType;
var CodecTestOperationType;
(function (CodecTestOperationType) {
    CodecTestOperationType[CodecTestOperationType["megaMenu"] = 0] = "megaMenu";
    CodecTestOperationType[CodecTestOperationType["getCategory"] = 1] = "getCategory";
    CodecTestOperationType[CodecTestOperationType["getProductById"] = 2] = "getProductById";
    CodecTestOperationType[CodecTestOperationType["getProductsByKeyword"] = 3] = "getProductsByKeyword";
    CodecTestOperationType[CodecTestOperationType["getProductsByProductIds"] = 4] = "getProductsByProductIds";
    CodecTestOperationType[CodecTestOperationType["getCustomerGroups"] = 5] = "getCustomerGroups";
})(CodecTestOperationType = exports.CodecTestOperationType || (exports.CodecTestOperationType = {}));
class CommerceCodec {
    constructor(config) {
        this.megaMenu = [];
        this.config = config;
    }
    init(codecType) {
        return __awaiter(this, void 0, void 0, function* () {
            const startInit = new Date().valueOf();
            yield this.cacheMegaMenu();
            this.initDuration = new Date().valueOf() - startInit;
            this.codecType = codecType;
            if (this.megaMenu.length === 0) {
                console.warn(`megaMenu has no categories, check setup`);
            }
            return this;
        });
    }
    findCategory(slug) {
        let flattenedCategories = [];
        const bulldozeCategories = cat => {
            flattenedCategories.push(cat);
            cat.children && cat.children.forEach(bulldozeCategories);
        };
        this.megaMenu.forEach(bulldozeCategories);
        return flattenedCategories.find(category => { var _a; return ((_a = category.slug) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (slug === null || slug === void 0 ? void 0 : slug.toLowerCase()); });
    }
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            this.megaMenu = [];
        });
    }
    // defined in terms of getProducts()
    getProduct(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return lodash_1.default.first(yield this.getProducts(Object.assign(Object.assign({}, args), { productIds: args.id })));
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn(`getProducts is not supported on platform [ ${this.codecType.vendor} ]`);
            return [];
        });
    }
    // defined in terms of getMegaMenu, effectively
    getCategory(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = this.findCategory(args.slug);
            category.products = yield this.getProducts(Object.assign(Object.assign({}, args), { category }));
            return category;
        });
    }
    getMegaMenu(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.megaMenu;
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn(`getCustomerGroups is not supported on platform [ ${this.codecType.vendor} ]`);
            return [];
        });
    }
    testIntegration() {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [{
                    operationType: CodecTestOperationType.megaMenu,
                    description: 'cache the megamenu',
                    arguments: '',
                    duration: this.initDuration,
                    results: this.megaMenu
                }];
            // 2: get a category by slug, which is done implicitly for all categories here
            let categories = yield Promise.all((0, __1.flattenCategories)(this.megaMenu).map((c) => __awaiter(this, void 0, void 0, function* () {
                let categoryStart = new Date().valueOf();
                let category = yield this.getCategory(c);
                results.push({
                    operationType: CodecTestOperationType.getCategory,
                    description: `get category by slug`,
                    arguments: category.slug,
                    duration: new Date().valueOf() - categoryStart,
                    results: category
                });
                return category;
            })));
            let productCategory = categories.find(cat => cat.products.length > 0);
            // 3: get a single product by id
            let singleProductStart = new Date().valueOf();
            let singleProductById = yield this.getProduct((0, exports.getRandom)(productCategory.products));
            results.push({
                operationType: CodecTestOperationType.getProductById,
                description: `get product by id`,
                arguments: singleProductById.id,
                duration: new Date().valueOf() - singleProductStart,
                results: singleProductById
            });
            // 4: search for a product
            let keywordStart = new Date().valueOf();
            let keyword = singleProductById.name.split(' ').pop();
            let searchResults = yield this.getProducts({ keyword });
            results.push({
                operationType: CodecTestOperationType.getProductsByKeyword,
                description: `get products by search keyword`,
                arguments: keyword,
                duration: new Date().valueOf() - keywordStart,
                results: searchResults
            });
            // 5: get a list of products given a list of product ids
            let prodsStart = new Date().valueOf();
            let prods = [singleProductById, ...lodash_1.default.take(searchResults, 1)];
            let productIds = prods.map(product => product.id).join(',');
            let productsByProductId = yield this.getProducts({ productIds });
            results.push({
                operationType: CodecTestOperationType.getProductsByProductIds,
                description: `get products by product ids`,
                arguments: productIds,
                duration: new Date().valueOf() - prodsStart,
                results: productsByProductId
            });
            // 6: get a list of customer groups
            let customerGroupStart = new Date().valueOf();
            let customerGroups = yield this.getCustomerGroups({});
            results.push({
                operationType: CodecTestOperationType.getCustomerGroups,
                description: `get customer groups`,
                arguments: '',
                duration: new Date().valueOf() - customerGroupStart,
                results: customerGroups
            });
            return results;
        });
    }
}
exports.CommerceCodec = CommerceCodec;
const getRandom = (array) => array[Math.floor(Math.random() * (array.length - 1))];
exports.getRandom = getRandom;
const codecs = new Map();
codecs[CodecTypes.commerce] = [];
// public interface
const getCodecs = (type) => {
    return codecs[type];
};
exports.getCodecs = getCodecs;
const registerCodec = (codec) => {
    if (!codecs[codec.type].includes(codec)) {
        codecs[codec.type].push(codec);
    }
};
exports.registerCodec = registerCodec;
// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map();
const maskSensitiveData = (obj) => {
    return Object.assign(Object.assign({}, obj), { client_secret: obj.client_secret && `**** redacted ****`, api_token: obj.api_token && `**** redacted ****`, password: obj.password && `**** redacted ****` });
};
const getCodec = (config, type) => __awaiter(void 0, void 0, void 0, function* () {
    let codecsMatchingConfig = (0, exports.getCodecs)(type).filter(c => lodash_1.default.difference(Object.keys(c.properties), Object.keys(config)).length === 0);
    if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
        return null;
        // throw new IntegrationError({
        //     message: `[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(maskSensitiveData(config), undefined, 4)}`,
        //     helpUrl: `https://help.dc-demostore.com/codec-error`
        // })
    }
    let configHash = lodash_1.default.values(config).join('');
    if (!apis[configHash]) {
        let CType = lodash_1.default.first(codecsMatchingConfig);
        // console.log(`[ demostore ] creating codec: ${CType.vendor}...`)
        let api = yield CType.getApi(config);
        apis[configHash] = api;
        // apis[configHash] = _.zipObject(Object.keys(api), Object.keys(api).filter(key => typeof api[key] === 'function').map((key: string) => {
        //     // apply default arguments for those not provided in the query
        //     return async (args: CommonArgs): Promise<any> => await api[key]({
        //         ...defaultArgs,
        //         ...args
        //     })
        // }))
    }
    return apis[configHash];
});
exports.getCodec = getCodec;
exports.defaultArgs = {
    locale: 'en-US',
    language: 'en',
    country: 'US',
    currency: 'USD',
    segment: ''
};
const getCommerceCodec = (config) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.getCodec)(config, CodecTypes.commerce); });
exports.getCommerceCodec = getCommerceCodec;
// end public interface
// register codecs
if ((0, util_1.isServer)()) {
    Promise.resolve().then(() => __importStar(require('./codecs/rest')));
    Promise.resolve().then(() => __importStar(require('./codecs/commercetools')));
    Promise.resolve().then(() => __importStar(require('./codecs/bigcommerce')));
    Promise.resolve().then(() => __importStar(require('./codecs/akeneo')));
    Promise.resolve().then(() => __importStar(require('./codecs/fabric')));
    Promise.resolve().then(() => __importStar(require('./codecs/constructor.io')));
    Promise.resolve().then(() => __importStar(require('./codecs/elasticpath')));
    Promise.resolve().then(() => __importStar(require('./codecs/hybris')));
    Promise.resolve().then(() => __importStar(require('./codecs/sfcc')));
}
// reexport codec common functions
__exportStar(require("./codecs/common"), exports);
