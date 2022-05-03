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
const lodash_1 = __importDefault(require("lodash"));
const mappers_1 = __importDefault(require("./mappers"));
const common_1 = require("../common");
// let x: RestCommerceCodecConfig = {
//     "productURL": {
//         "type": "string",
//         "title": "Product URL",
//         "description": "URL to a product JSON file"
//     },
//     "categoryURL": {
//         "type": "string",
//         "title": "Category URL",
//         "description": "URL to a category JSON file"
//     },
//     "customerGroupURL": {
//         "type": "string",
//         "title": "Customer Group URL",
//         "description": "URL to a customer group JSON file"
//     },
//     "translationsURL": {
//         "type": "string",
//         "title": "Translations URL",
//         "description": "URL to a translations JSON file"
//     }
// }
// export interface RestCommerceCodecConfig extends CodecConfiguration {
//     productURL: string
//     categoryURL: string
//     customerGroupURL: string
//     translationsURL: string
// }
let categories = [];
let products = [];
let customerGroups = [];
let translations = {};
let api = null;
const fetchFromURL = (url, defaultValue) => __awaiter(void 0, void 0, void 0, function* () { return lodash_1.default.isEmpty(url) ? defaultValue : yield (yield fetch(url)).json(); });
const restCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/rest',
    getAPI: function (config) {
        if (!config.productURL) {
            return null;
        }
        const loadAPI = () => __awaiter(this, void 0, void 0, function* () {
            if (lodash_1.default.isEmpty(products)) {
                products = yield fetchFromURL(config.productURL, []);
                categories = yield fetchFromURL(config.categoryURL, []);
                customerGroups = yield fetchFromURL(config.customerGroupURL, []);
                translations = yield fetchFromURL(config.translationsURL, {});
            }
            api = {
                getProductsForCategory: (category) => {
                    return lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), category.id));
                },
                getProduct: (args) => {
                    return args.id && lodash_1.default.find(products, prod => args.id === prod.id) ||
                        args.slug && lodash_1.default.find(products, prod => args.slug === prod.slug);
                },
                getProducts: (args) => {
                    var _a;
                    let productIds = (_a = args.productIds) === null || _a === void 0 ? void 0 : _a.split(',');
                    return productIds && lodash_1.default.filter(products, prod => productIds.includes(prod.id)) ||
                        args.keyword && lodash_1.default.filter(products, prod => prod.name.toLowerCase().indexOf(args.keyword) > -1);
                },
                getCategory: (args) => {
                    return api.populateCategory((0, common_1.findInMegaMenu)(categories, args.slug));
                },
                populateCategory: (category) => (Object.assign(Object.assign({}, category), { products: lodash_1.default.take(lodash_1.default.uniqBy([
                        ...api.getProductsForCategory(category),
                        ...lodash_1.default.flatMap(category.children, api.getProductsForCategory)
                    ], 'slug'), 12) })),
                getCustomerGroups: () => {
                    return customerGroups;
                }
            };
        });
        return {
            getProduct: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield loadAPI();
                    let product = api.getProduct(args);
                    if (product) {
                        return mappers_1.default.mapProduct(product, args);
                    }
                });
            },
            getProducts: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield loadAPI();
                    let filtered = api.getProducts(args);
                    if (!filtered) {
                        throw new Error(`Products not found for args: ${JSON.stringify(args)}`);
                    }
                    return filtered.map(prod => mappers_1.default.mapProduct(prod, args));
                });
            },
            getCategory: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield loadAPI();
                    let category = api.getCategory(args);
                    if (!category) {
                        throw new Error(`Category not found for args: ${JSON.stringify(args)}`);
                    }
                    return mappers_1.default.mapCategory(api.populateCategory(category));
                });
            },
            getMegaMenu: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield loadAPI();
                    return categories.filter(cat => !cat.parent).map(mappers_1.default.mapCategory);
                });
            },
            getCustomerGroups: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield loadAPI();
                    return api.getCustomerGroups();
                });
            }
        };
    }
};
exports.default = restCodec;
