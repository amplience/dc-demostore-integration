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
const __2 = require("../../..");
const index_1 = require("../../index");
const common_1 = require("../common");
const btoa_1 = __importDefault(require("btoa"));
const properties = Object.assign(Object.assign({}, __2.UsernamePasswordProperties), __2.ClientCredentialProperties);
const shopifyCodec = {
    metadata: {
        type: index_1.CodecType.commerce,
        properties,
        vendor: 'shopify'
    },
    getAPI: function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = (0, __2.OAuthRestClient)({
                api_url: `${config.api_url}/api/rest/v1`,
                auth_url: `${config.api_url}/api/oauth/v1/token`
            }, {
                username: config.username,
                password: config.password,
                grant_type: 'password'
            }, {
                headers: {
                    Authorization: `Basic ${(0, btoa_1.default)(`${config.client_id}:${config.client_secret}`)}`
                }
            }, (auth) => ({
                Authorization: `Bearer ${auth.access_token}`
            }));
            const fetch = (url) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield rest.get({ url });
                    return result._embedded ? result._embedded.items : result;
                }
                catch (error) {
                    console.log(`error url [ ${url} ]`);
                }
            });
            let categories = yield fetch('/categories?limit=100');
            categories = lodash_1.default.concat(categories, yield fetch('/categories?limit=100&page=2'));
            categories = lodash_1.default.concat(categories, yield fetch('/categories?limit=100&page=3'));
            const mapCategory = (category) => (Object.assign({}, category));
            const findValue = (values) => { var _a; return values && ((_a = values.find(value => !value.locale || value.locale === 'en_US')) === null || _a === void 0 ? void 0 : _a.data); };
            const mapProduct = (args) => (product) => {
                return product;
            };
            // 'master' is the catalog root node, so top-level categories its children
            let megaMenu = [];
            megaMenu = (0, common_1.findInMegaMenu)(megaMenu, 'master').children;
            const api = {
                getProductById: (args) => (id) => __awaiter(this, void 0, void 0, function* () {
                    // return mapProduct(args)(await fetch(`/products/${id}`))
                    return null;
                }),
                getProduct: (args) => __awaiter(this, void 0, void 0, function* () {
                    // return await api.getProductById(args)(args.id)
                    return null;
                }),
                getProducts: (args) => __awaiter(this, void 0, void 0, function* () {
                    // if (args.productIds) {
                    //     return await Promise.all(args.productIds.split(',').map(api.getProductById(args)))
                    // }
                    // else if (args.keyword) {
                    //     let searchResults = await fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`)
                    //     return searchResults.map(mapProduct(args))
                    // }
                    // else if (args.category) {
                    //     let products = await fetch(`/products?search={"categories":[{"operator":"IN","value":["${args.category.id}"]}]}`)
                    //     return products.map(mapProduct(args))
                    // }
                    return [];
                }),
                getCategory: (args) => __awaiter(this, void 0, void 0, function* () {
                    return null;
                }),
                getMegaMenu: () => __awaiter(this, void 0, void 0, function* () {
                    return megaMenu;
                }),
                getCustomerGroups: () => __awaiter(this, void 0, void 0, function* () {
                    return [];
                }),
                getVariants: () => __awaiter(this, void 0, void 0, function* () {
                    return;
                })
            };
            return api;
        });
    }
};
(0, __1.registerCodec)(shopifyCodec);
