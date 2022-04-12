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
const index_1 = require("../../../index");
const sfccCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/sfcc',
    getAPI: (config) => __awaiter(void 0, void 0, void 0, function* () {
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield axios_1.default.request({
                method: 'get',
                url,
                baseURL: config.api_url,
                params: {
                    client_id: config.client_id
                }
            })).data;
        });
        // authenticated fetch based on oauth creds passed in (not needed for store apis)
        let rest = (0, index_1.OAuthRestClient)(config);
        yield rest.authenticate({
            grant_type: 'client_credentials'
        }, {
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
                    children: ((_a = cat.categories) === null || _a === void 0 ? void 0 : _a.map(api.mapCategory)) || [],
                    products: []
                });
            }
        };
        return {
            getProduct: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    // if (query.args.id) {
                    //     return mapProduct(await api.getProductById(query.args.id))
                    // }
                    throw new Error(`getProduct(): must specify id`);
                });
            },
            getProducts: function (query) {
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
            getCategory: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!query.args.slug) {
                        throw new Error(`getCategory(): must specify slug`);
                    }
                    let category = yield api.getCategory(query.args.slug);
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
    })
};
exports.default = sfccCodec;
(0, codec_1.registerCodec)(sfccCodec);
