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
const mappers_1 = require("./mappers");
const common_1 = require("../common");
const rest_client_1 = require("../../../common/rest-client");
const properties = Object.assign(Object.assign({}, rest_client_1.APIProperties), { api_token: {
        title: "API Token",
        type: "string"
    }, store_hash: {
        title: "Store hash",
        type: "string"
    } });
const bigCommerceCodec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/bigcommerce',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbiO1xUphQh2fOp8cbLS0_NkELL3oyq9QP7DgcJ5d1YMcUx5tkpY7FpFzVGaU-zKkE3ss&usqp=CAU',
        properties
    },
    getAPI: (config) => {
        if (!config.store_hash) {
            return null;
        }
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield axios_1.default.request({
                method: 'get',
                url,
                baseURL: `${config.api_url}/stores/${config.store_hash}`,
                headers: {
                    'X-Auth-Token': config.api_token,
                    'Accept': `application/json`,
                    'Content-Type': `application/json`
                }
            });
            if (url.indexOf('customer_groups') > -1) {
                return response.data;
            }
            return response.data.data;
        });
        const api = {
            getCategoryTree: () => fetch(`/v3/catalog/categories/tree`),
            getProducts: () => fetch(`/v3/catalog/products`),
            searchProducts: keyword => fetch(`/v3/catalog/products?keyword=${keyword}`),
            getProductById: id => fetch(`/v3/catalog/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/v3/catalog/products?categories:in=${cat.id}`),
            getCustomerGroups: () => fetch(`/v2/customer_groups`)
        };
        const getMegaMenu = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield api.getCategoryTree()).map(mappers_1.mapCategory);
            });
        };
        return {
            getProduct: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (args.id) {
                        return (0, mappers_1.mapProduct)(yield api.getProductById(args.id));
                    }
                    throw new Error(`getProduct(): must specify id`);
                });
            },
            getProducts: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (args.productIds) {
                        return yield Promise.all(args.productIds.split(',').map((id) => __awaiter(this, void 0, void 0, function* () { return (0, mappers_1.mapProduct)(yield api.getProductById(id)); })));
                    }
                    else if (args.keyword) {
                        return (yield api.searchProducts(args.keyword)).map(mappers_1.mapProduct);
                    }
                    throw new Error(`getProducts(): must specify either productIds or keyword`);
                });
            },
            getCategory: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!args.slug) {
                        throw new Error(`getCategory(): must specify slug`);
                    }
                    let category = (0, common_1.findInMegaMenu)(yield getMegaMenu(args), args.slug);
                    return Object.assign(Object.assign({}, category), { products: (yield api.getProductsForCategory(category)).map(mappers_1.mapProduct) });
                });
            },
            getMegaMenu,
            getCustomerGroups: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return (yield api.getCustomerGroups()).map(mappers_1.mapCustomerGroup);
                });
            }
        };
    }
};
exports.default = bigCommerceCodec;
