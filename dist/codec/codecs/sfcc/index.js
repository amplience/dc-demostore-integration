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
const index_1 = require("../../../index");
const rest_client_1 = require("../../../common/rest-client");
const properties = Object.assign(Object.assign(Object.assign({}, rest_client_1.OAuthProperties), rest_client_1.ClientCredentialProperties), { api_token: {
        title: "Shopper API Token",
        type: "string",
        maxLength: 100
    }, site_id: {
        title: "Site ID",
        type: "string"
    } });
const sfccCodec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/sfcc',
        icon: 'https://www.pikpng.com/pngl/b/321-3219605_salesforce-logo-png-clipart.png',
        properties
    },
    getAPI: (config) => {
        if (!config.api_token) {
            return null;
        }
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield axios_1.default.get(url, {
                baseURL: config.api_url,
                params: {
                    client_id: config.client_id
                }
            })).data;
        });
        // authenticated fetch based on oauth creds passed in (not needed for store apis)
        let rest = (0, index_1.OAuthRestClient)(Object.assign(Object.assign({}, config), { auth_url: `${config.auth_url}?grant_type=client_credentials` }), {}, {
            headers: {
                Authorization: 'Basic ' + config.api_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const authenticatedFetch = (url) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url })).data; });
        // end authenticated fetch
        const api = {
            getCategory: (slug = 'root') => __awaiter(void 0, void 0, void 0, function* () {
                return api.mapCategory(yield fetch(`/s/${config.site_id}/dw/shop/v20_4/categories/${slug}?levels=4`));
            }),
            getCustomerGroups: () => __awaiter(void 0, void 0, void 0, function* () {
                return (yield authenticatedFetch(`/s/-/dw/data/v22_4/sites/${config.site_id}/customer_groups`)).map(api.mapCustomerGroup);
            }),
            getProducts: () => fetch(`/products`),
            searchProducts: keyword => fetch(`/products?keyword=${keyword}`),
            getProductById: id => fetch(`/products/${id}?include=images,variants`),
            getProductsForCategory: cat => fetch(`/products?categories:in=${cat.id}`),
            mapCustomerGroup: (group) => (Object.assign(Object.assign({}, group), { name: group.id })),
            mapCategory: (cat) => {
                var _a;
                return ({
                    id: cat.id,
                    slug: cat.id,
                    name: cat.name,
                    image: { url: cat.image },
                    children: ((_a = cat.categories) === null || _a === void 0 ? void 0 : _a.map(api.mapCategory)) || [],
                    products: []
                });
            }
        };
        return {
            getProduct: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    // if (query.args.id) {
                    //     return mapProduct(await api.getProductById(query.args.id))
                    // }
                    throw new Error(`getProduct(): must specify id`);
                });
            },
            getProducts: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    // if (query.args.productIds) {
                    //     return await Promise.all(query.args.productIds.split(',').map(async id => mapProduct(await api.getProductById(id))))
                    // }
                    // else if (query.args.keyword) {
                    //     return (await api.searchProducts(query.args.keyword)).map(mapProduct)
                    // }
                    throw new Error(`getProducts(): must specify either productIds or keyword`);
                });
            },
            getCategory: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!args.slug) {
                        throw new Error(`getCategory(): must specify slug`);
                    }
                    let category = yield api.getCategory(args.slug);
                    return Object.assign(Object.assign({}, category), { products: yield api.getProductsForCategory(category) });
                });
            },
            getMegaMenu: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield (yield api.getCategory()).children;
                });
            },
            getCustomerGroups: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield api.getCustomerGroups();
                });
            }
        };
    }
};
exports.default = sfccCodec;
