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
const slugify_1 = __importDefault(require("slugify"));
const btoa_1 = __importDefault(require("btoa"));
const properties = Object.assign(Object.assign(Object.assign({}, __2.UsernamePasswordProperties), __2.ClientCredentialProperties), { rootCategory: {
        title: "Root category ID",
        type: "string"
    } });
const akeneoCodec = {
    schema: {
        type: index_1.CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/akeneo',
        icon: 'https://static.crozdesk.com/web_app_library/providers/logos/000/006/691/original/akeneo-pim-1559230789-logo.png?1559230789',
        properties
    },
    getAPI: function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = (0, __2.OAuthRestClient)({
                api_url: `${config.api_url}/api/rest/v1`,
                auth_url: `${config.api_url}/api/oauth/v1/token`
            }, {
                username: config.username,
                password: config.password,
                grant_type: "password"
            }, {
                headers: {
                    Authorization: `Basic ${(0, btoa_1.default)(`${config.client_id}:${config.client_secret}`)}`
                }
            }, (auth) => ({
                Authorization: `Bearer ${auth.access_token}`
            }));
            const fetch = (url) => __awaiter(this, void 0, void 0, function* () {
                let result = yield rest.get({ url });
                return result._embedded ? result._embedded.items : result;
            });
            let categories = yield fetch('/categories');
            const mapCategory = (category) => ({
                id: category.code,
                name: category.labels['en_US'],
                slug: category.code,
                children: [],
                products: []
            });
            const findValue = (values) => values && values.find(value => !value.locale || value.locale === 'en_US').data;
            const mapProduct = (product) => ({
                id: product.identifier,
                name: findValue(product.values.name),
                slug: product.values.name && (0, slugify_1.default)(findValue(product.values.name), { lower: true }),
                shortDescription: findValue(product.values.description),
                longDescription: findValue(product.values.description),
                categories: [],
                variants: [{
                        sku: product.identifier,
                        listPrice: '0.00',
                        salePrice: '0.00',
                        images: [],
                        attributes: lodash_1.default.mapValues(product.values, findValue)
                    }]
            });
            // 'master' is the catalog root node, so top-level categories its children
            let megaMenu = [];
            categories.forEach(cat => {
                if (cat.code === 'master') {
                    // top level category
                    megaMenu.push(mapCategory(cat));
                }
                else {
                    // try to find in the megamenu
                    let parent = (0, common_1.findInMegaMenu)(megaMenu, cat.parent);
                    if (parent) {
                        parent.children.push(mapCategory(cat));
                    }
                }
            });
            megaMenu = (0, common_1.findInMegaMenu)(megaMenu, config.rootCategory === '' ? 'master' : config.rootCategory).children;
            const api = {
                getProductById: (id) => __awaiter(this, void 0, void 0, function* () {
                    return mapProduct(yield fetch(`/products/${id}`));
                }),
                getProduct: (args) => __awaiter(this, void 0, void 0, function* () {
                    return yield api.getProductById(args.id);
                }),
                getProducts: (args) => __awaiter(this, void 0, void 0, function* () {
                    if (args.productIds) {
                        return yield Promise.all(args.productIds.split(',').map(api.getProductById));
                    }
                    else if (args.keyword) {
                        let searchResults = yield fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`);
                        return searchResults.map(mapProduct);
                    }
                }),
                getCategory: (args) => __awaiter(this, void 0, void 0, function* () {
                    return yield api.populateCategory((0, common_1.findInMegaMenu)(megaMenu, args.slug));
                }),
                populateCategory: (category) => __awaiter(this, void 0, void 0, function* () {
                    let products = yield fetch(`/products?search={"categories":[{"operator":"IN","value":["${category.id}"]}]}`);
                    category.products = products.map(mapProduct);
                    return category;
                }),
                getMegaMenu: () => __awaiter(this, void 0, void 0, function* () {
                    return megaMenu;
                }),
                getCustomerGroups: () => __awaiter(this, void 0, void 0, function* () {
                    return [];
                })
            };
            return api;
        });
    }
};
(0, __1.registerCodec)(akeneoCodec);
