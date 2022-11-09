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
const rest_client_1 = __importStar(require("../../../common/rest-client"));
const index_1 = require("../../index");
const slugify_1 = __importDefault(require("slugify"));
const util_1 = require("../../../common/util");
const common_1 = require("../common");
const properties = Object.assign(Object.assign({}, rest_client_1.ClientCredentialProperties), { api_token: {
        title: 'Shopper API Token',
        type: 'string',
        maxLength: 100
    }, site_id: {
        title: 'Site ID',
        type: 'string'
    } });
const sfccCodec = {
    metadata: {
        type: index_1.CodecType.commerce,
        vendor: 'sfcc',
        properties
    },
    getAPI: (config) => __awaiter(void 0, void 0, void 0, function* () {
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                return (yield axios_1.default.get(url, {
                    baseURL: config.api_url,
                    params: {
                        client_id: config.client_id
                    }
                })).data;
            }
            catch (error) {
                console.log(`url ${url} status ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}`);
                if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                    return null;
                }
                else {
                    throw error;
                }
            }
        });
        // authenticated fetch based on oauth creds passed in (not needed for store apis)
        const rest = (0, rest_client_1.default)(Object.assign(Object.assign({}, config), { auth_url: `${config.auth_url}?grant_type=client_credentials` }), {}, {
            headers: {
                Authorization: 'Basic ' + config.api_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const authenticatedFetch = (url) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url })).data; });
        // end authenticated fetch
        const shopApi = `/s/${config.site_id}/dw/shop/v22_4`;
        const sitesApi = `/s/-/dw/data/v22_4/sites/${config.site_id}`;
        const api = (args) => ({
            getCategory: (slug = 'root') => __awaiter(void 0, void 0, void 0, function* () {
                return api(args).mapCategory(yield fetch(`${shopApi}/categories/${slug}?levels=4`));
            }),
            getCustomerGroups: () => __awaiter(void 0, void 0, void 0, function* () {
                return (yield authenticatedFetch(`${sitesApi}/customer_groups`)).map(api(args).mapCustomerGroup);
            }),
            getProducts: (productIds) => __awaiter(void 0, void 0, void 0, function* () {
                return yield Promise.all(productIds.map(api(args).getProductById));
            }),
            search: (query) => __awaiter(void 0, void 0, void 0, function* () {
                const searchResults = (yield fetch(`${shopApi}/product_search?${query}`)).hits;
                if (searchResults) {
                    return yield api(args).getProducts(searchResults.map(sr => sr.product_id));
                }
                return [];
            }),
            searchProducts: (keyword) => __awaiter(void 0, void 0, void 0, function* () {
                return yield api(args).search(`q=${keyword}`);
            }),
            getProductsForCategory: (cat) => __awaiter(void 0, void 0, void 0, function* () {
                return yield api(args).search(`refine_1=cgid=${cat.id}`);
            }),
            getProductById: (id) => __awaiter(void 0, void 0, void 0, function* () {
                return api(args).mapProduct(yield fetch(`${shopApi}/products/${id}?expand=prices,options,images,variations`));
            }),
            getVariants: (id) => __awaiter(void 0, void 0, void 0, function* () {
                return yield fetch(`${shopApi}/products/${id}/variations`);
            }),
            mapProduct: (product) => {
                var _a;
                if (!product) {
                    return null;
                }
                const largeImages = product.image_groups.find(group => group.view_type === 'large');
                const images = largeImages.images.map(image => ({ url: image.link }));
                return Object.assign(Object.assign({}, product), { slug: (0, slugify_1.default)(product.name, { lower: true }), categories: [], variants: ((_a = product.variants) === null || _a === void 0 ? void 0 : _a.map(variant => ({
                        sku: variant.product_id,
                        listPrice: (0, util_1.formatMoneyString)(variant.price, { currency: product.currency, locale: args.locale }),
                        salePrice: (0, util_1.formatMoneyString)(variant.price, { currency: product.currency, locale: args.locale }),
                        images,
                        attributes: variant.variation_values
                    }))) || [{
                            sku: product.id,
                            listPrice: (0, util_1.formatMoneyString)(product.price, { currency: product.currency, locale: args.locale }),
                            salePrice: (0, util_1.formatMoneyString)(product.price, { currency: product.currency, locale: args.locale }),
                            images,
                            attributes: {}
                        }] });
            },
            mapCustomerGroup: (group) => group && (Object.assign(Object.assign({}, group), { name: group.id })),
            mapCategory: (cat) => {
                var _a;
                if (!cat) {
                    return null;
                }
                return {
                    id: cat.id,
                    slug: cat.id,
                    name: cat.name,
                    children: ((_a = cat.categories) === null || _a === void 0 ? void 0 : _a.map(api(args).mapCategory)) || [],
                    products: []
                };
            }
        });
        const megaMenu = yield (yield api({}).getCategory()).children;
        return {
            getProduct: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield api(args).getProductById(args.id);
                });
            },
            getProducts: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (args.productIds) {
                        return yield api(args).getProducts(args.productIds.split(','));
                    }
                    else if (args.keyword) {
                        return yield api(args).searchProducts(args.keyword);
                    }
                });
            },
            getVariants: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield api(args).getVariants(args.productId);
                });
            },
            getCategory: function (args) {
                return __awaiter(this, void 0, void 0, function* () {
                    // let category = await api(args).getCategory(args.slug)
                    const category = (0, common_1.findInMegaMenu)(megaMenu, args.slug);
                    if (category) {
                        return Object.assign(Object.assign({}, category), { products: yield api(args).getProductsForCategory(category) });
                    }
                    return null;
                });
            },
            getMegaMenu: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return megaMenu;
                });
            },
            getCustomerGroups: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield api({}).getCustomerGroups();
                });
            }
        };
    })
};
(0, index_1.registerCodec)(sfccCodec);
