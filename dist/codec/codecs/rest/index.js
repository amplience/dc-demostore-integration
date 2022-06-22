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
const __1 = require("../..");
const mappers_1 = __importDefault(require("./mappers"));
const index_1 = require("../../index");
const properties = {
    productURL: {
        title: "Product file URL",
        type: "string"
    },
    categoryURL: {
        title: "Category file URL",
        type: "string"
    },
    customerGroupURL: {
        title: "Customer group file URL",
        type: "string"
    },
    translationsURL: {
        title: "Translations file URL",
        type: "string"
    }
};
const fetchFromURL = (url, defaultValue) => __awaiter(void 0, void 0, void 0, function* () { return lodash_1.default.isEmpty(url) ? defaultValue : yield (yield fetch(url)).json(); });
const restCodec = {
    schema: {
        type: index_1.CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/rest',
        icon: 'https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/rest.png',
        properties
    },
    getAPI: function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield fetchFromURL(config.categoryURL, []);
            const products = yield fetchFromURL(config.productURL, []);
            const customerGroups = yield fetchFromURL(config.customerGroupURL, []);
            const translations = yield fetchFromURL(config.translationsURL, {});
            const api = {
                getProductsForCategory: (category) => {
                    return [
                        ...lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), category.id)),
                        ...lodash_1.default.flatMap(category.children.map(api.getProductsForCategory))
                    ];
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
                    let category = categories.find(cat => cat.slug === args.slug);
                    if (category) {
                        return api.populateCategory(category, args);
                    }
                    return null;
                },
                populateCategory: (category, args) => (Object.assign(Object.assign({}, category), { products: lodash_1.default.take(api.getProductsForCategory(category), 12).map(prod => mappers_1.default.mapProduct(prod, args)) })),
                getCustomerGroups: () => {
                    return customerGroups;
                }
            };
            return {
                getProduct: function (args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let product = api.getProduct(args);
                        if (product) {
                            return mappers_1.default.mapProduct(product, args);
                        }
                    });
                },
                getProducts: function (args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let filtered = api.getProducts(args);
                        if (filtered) {
                            return filtered.map(prod => mappers_1.default.mapProduct(prod, args));
                        }
                        return null;
                    });
                },
                getCategory: function (args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let category = api.getCategory(args);
                        if (category) {
                            return mappers_1.default.mapCategory(api.populateCategory(category, args));
                        }
                        return null;
                    });
                },
                getMegaMenu: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return categories.filter(cat => !cat.parent).map(mappers_1.default.mapCategory);
                    });
                },
                getCustomerGroups: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return api.getCustomerGroups();
                    });
                }
            };
        });
    }
};
(0, __1.registerCodec)(restCodec);
