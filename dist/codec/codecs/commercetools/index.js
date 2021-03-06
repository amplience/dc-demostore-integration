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
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("../..");
const util_1 = require("../../../common/util");
const rest_client_1 = __importStar(require("../../../common/rest-client"));
const cats = ['women', 'men', 'new', 'sale', 'accessories'];
const quote = (str) => `"${str}"`;
const commerceToolsCodec = {
    metadata: {
        type: __1.CodecType.commerce,
        vendor: 'commercetools',
        properties: Object.assign(Object.assign({}, rest_client_1.ClientCredentialProperties), { project: {
                title: "project key",
                type: "string"
            }, scope: {
                title: "scope",
                type: "string",
                maxLength: 1000
            } })
    },
    getAPI: (config) => __awaiter(void 0, void 0, void 0, function* () {
        const rest = (0, rest_client_1.default)({
            api_url: `${config.api_url}/${config.project}`,
            auth_url: `${config.auth_url}?grant_type=client_credentials`
        }, {}, {
            auth: {
                username: config.client_id,
                password: config.client_secret
            }
        });
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url })).results; });
        // caching the categories in CT as recommended here: https://docs.commercetools.com/tutorials/product-modeling/categories#best-practices-categories
        const categories = yield fetch(`/categories?limit=500`);
        const getMapper = (args) => {
            const findPrice = (variant) => {
                let price = variant.prices &&
                    (variant.prices.find(price => price.country === args.country && price.value.currencyCode === args.currency) ||
                        variant.prices.find(price => price.value.currencyCode === args.currency) ||
                        lodash_1.default.first(variant.prices));
                if (!price) {
                    return '--';
                }
                else {
                    return (0, util_1.formatMoneyString)((price.value.centAmount / Math.pow(10, price.value.fractionDigits)), args);
                }
            };
            const mapCategory = (category) => ({
                id: category.id,
                name: localize(category.name),
                slug: localize(category.slug),
                children: categories.filter(cat => { var _a; return ((_a = cat.parent) === null || _a === void 0 ? void 0 : _a.id) === category.id; }).map(mapCategory),
                products: []
            });
            const localize = (localizable) => {
                return localizable[args.language] || localizable.en;
            };
            const getAttributeValue = (attribute) => {
                if (typeof attribute.value === 'string') {
                    return attribute.value;
                }
                else if (typeof attribute.value.label === 'string') {
                    return attribute.value.label;
                }
                else if (attribute.value.label) {
                    return localize(attribute.value.label);
                }
                else {
                    return localize(attribute.value);
                }
            };
            const mapProduct = (product) => ({
                id: product.id,
                name: localize(product.name),
                slug: localize(product.slug),
                variants: lodash_1.default.isEmpty(product.variants) ? [product.masterVariant].map(mapVariant) : product.variants.map(mapVariant),
                categories: []
            });
            const mapVariant = (variant) => {
                return {
                    sku: variant.sku,
                    images: variant.images,
                    listPrice: findPrice(variant),
                    // todo: get discounted price
                    salePrice: findPrice(variant),
                    attributes: lodash_1.default.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(getAttributeValue))
                };
            };
            return {
                findPrice,
                mapCategory,
                localize,
                getAttributeValue,
                mapProduct,
                mapVariant
            };
        };
        // CommerceAPI implementation
        const getProduct = (args) => __awaiter(void 0, void 0, void 0, function* () {
            return lodash_1.default.first(yield getProducts(Object.assign(Object.assign({}, args), { productIds: args.id })));
        });
        const getProducts = (args) => __awaiter(void 0, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                let queryIds = args.productIds.split(',').map(quote).join(',');
                products = yield fetch(`/product-projections/search?filter=id:${queryIds}`);
            }
            else if (args.keyword) {
                products = yield fetch(`/product-projections/search?text.en="${args.keyword}"`);
            }
            else if (args.category) {
                products = yield fetch(`/product-projections/search?filter=categories.id: subtree("${args.category.id}")`);
            }
            return products.map(getMapper(args).mapProduct);
        });
        const getMegaMenu = (args) => __awaiter(void 0, void 0, void 0, function* () {
            return categories.filter(cat => cats.includes(cat.slug.en)).map(getMapper(args).mapCategory);
        });
        const getCustomerGroups = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield fetch(`/customer-groups`);
        });
        // end CommerceAPI
        return {
            getProduct,
            getProducts,
            getMegaMenu,
            getCustomerGroups
        };
    })
};
(0, __1.registerCodec)(commerceToolsCodec);
