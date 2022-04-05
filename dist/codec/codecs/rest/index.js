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
const common_1 = require("../common");
let categories = [];
let products = [];
let translations = {};
const restCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/rest',
    getAPI: function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[ rest-codec ] loading start...`);
            const startTime = new Date();
            products = yield (yield fetch(config.productURL)).json();
            categories = yield (yield fetch(config.categoryURL)).json();
            translations = yield (yield fetch(config.translationsURL)).json();
            console.log(`[ rest-codec ] products loaded: ${products.length}`);
            console.log(`[ rest-codec ] categories loaded: ${categories.length}`);
            console.log(`[ rest-codec ] loading duration: ${new Date().getTime() - startTime.getTime()}`);
            const api = {
                getProductsForCategory: (category) => lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), category.id)),
                getProduct: (query) => {
                    return query.args.id && lodash_1.default.find(products, prod => query.args.id === prod.id) ||
                        query.args.key && lodash_1.default.find(products, prod => query.args.key === prod.slug) ||
                        query.args.sku && lodash_1.default.find(products, prod => lodash_1.default.map(prod.variants, 'sku').includes(query.args.sku));
                },
                getProducts: (query) => {
                    var _a;
                    let productIds = (_a = query.args.productIds) === null || _a === void 0 ? void 0 : _a.split(',');
                    return productIds && lodash_1.default.filter(products, prod => productIds.includes(prod.id)) ||
                        query.args.keyword && lodash_1.default.filter(products, prod => prod.name.toLowerCase().indexOf(query.args.keyword) > -1) ||
                        query.args.categoryId && lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), query.args.categoryId));
                },
                getCategory: (query) => {
                    var _a;
                    return (0, common_1.findInMegaMenu)(categories, (_a = query.args) === null || _a === void 0 ? void 0 : _a.slug);
                },
                populateCategory: (category, context) => (Object.assign(Object.assign({}, category), { products: lodash_1.default.take([
                        ...api.getProductsForCategory(category),
                        ...lodash_1.default.flatMap(category.children, api.getProductsForCategory)
                    ], 12) }))
            };
            return {
                getProduct: function (query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let product = api.getProduct(query);
                        if (product) {
                            return mappers_1.default.mapProduct(product, query);
                        }
                    });
                },
                getProducts: function (query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let filtered = api.getProducts(query);
                        if (!filtered) {
                            throw new Error(`Products not found for args: ${JSON.stringify(query.args)}`);
                        }
                        return filtered.map(prod => mappers_1.default.mapProduct(prod, query));
                    });
                },
                getCategory: function (query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let category = api.getCategory(query);
                        if (!category) {
                            throw new Error(`Category not found for args: ${JSON.stringify(query.args)}`);
                        }
                        return mappers_1.default.mapCategory(api.populateCategory(category, query));
                    });
                },
                getMegaMenu: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return categories.filter(cat => !cat.parent).map(mappers_1.default.mapCategory);
                    });
                }
            };
        });
    }
};
exports.default = restCodec;
(0, __1.registerCodec)(restCodec);
