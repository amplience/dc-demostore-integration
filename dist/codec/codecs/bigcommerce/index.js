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
const axios_1 = __importDefault(require("axios"));
const codec_1 = require("../../../codec");
const mappers_1 = require("./mappers");
const common_1 = require("../common");
const bigCommerceCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/bigcommerce',
    getAPI: (config) => __awaiter(void 0, void 0, void 0, function* () {
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield axios_1.default.request({
                method: 'get',
                url,
                baseURL: `${config.api_url}/stores/${config.store_hash}/v3/catalog`,
                headers: {
                    'X-Auth-Token': config.api_token,
                    'Content-Type': `application/json`
                }
            })).data.data;
        });
        const api = {
            getCategoryTree: () => fetch(`/categories/tree`),
            getProducts: () => fetch(`/products`),
            searchProducts: keyword => fetch(`/products?keyword=${keyword}`),
            getProductById: id => fetch(`/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/products?categories:in=${cat.id}`)
        };
        return {
            getProduct: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (query.args.id) {
                        return (0, mappers_1.mapProduct)(yield api.getProductById(query.args.id));
                    }
                    throw new Error(`getProduct(): must specify id`);
                });
            },
            getProducts: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (query.args.productIds) {
                        return yield Promise.all(query.args.productIds.split(',').map((id) => __awaiter(this, void 0, void 0, function* () { return (0, mappers_1.mapProduct)(yield api.getProductById(id)); })));
                    }
                    else if (query.args.keyword) {
                        return (yield api.searchProducts(query.args.keyword)).map(mappers_1.mapProduct);
                    }
                    throw new Error(`getProducts(): must specify either productIds or keyword`);
                });
            },
            getCategory: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!query.args.slug) {
                        throw new Error(`getCategory(): must specify slug`);
                    }
                    let category = (0, common_1.findInMegaMenu)(yield this.getMegaMenu(), query.args.slug);
                    return Object.assign(Object.assign({}, category), { products: yield api.getProductsForCategory(category) });
                });
            },
            getMegaMenu: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return (yield api.getCategoryTree()).map(mappers_1.mapCategory);
                });
            }
        };
    })
};
exports.default = bigCommerceCodec;
(0, codec_1.registerCodec)(bigCommerceCodec);
