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
exports.RestCommerceCodec = void 0;
const lodash_1 = __importDefault(require("lodash"));
const codec_1 = require("../../../codec/codec");
const codec_manager_1 = require("../../../codec/codec-manager");
const getAttribute = (variant, attributeName) => lodash_1.default.get(lodash_1.default.find(variant.attributes, att => att.name === attributeName), 'value');
class RestCommerceCodec extends codec_1.CommerceCodec {
    constructor() {
        super(...arguments);
        this.categories = [];
        this.products = [];
        this.translations = {};
        this.translatePrice = (price, context) => new Intl.NumberFormat(context.getLocale(), { style: 'currency', currency: context.currency }).format(parseFloat(price));
        this.mapProduct = (context) => (product) => {
            product.imageSetId = getAttribute(product.variants[0], 'articleNumberMax');
            lodash_1.default.each(product.variants, (variant) => {
                lodash_1.default.each(variant.attributes, (value, key) => {
                    variant.articleNumberMax = getAttribute(variant, 'articleNumberMax') || '';
                    variant.size = getAttribute(variant, 'size') || '';
                    variant.color = getAttribute(variant, 'color') || '';
                });
                // map currency code
                variant.listPrice = variant.prices.list && this.translatePrice(variant.prices.list, context) || '';
                variant.salePrice = variant.prices.sale && this.translatePrice(variant.prices.sale, context) || '';
            });
            return product;
        };
        this.mapCategory = (context, depth = 0) => (category) => {
            var _a;
            if (!category) {
                throw new Error(`Category not found`);
            }
            const getCategoryIdsFromCategory = (category) => {
                let ids = [category.id];
                if (category.parent) {
                    ids = lodash_1.default.concat(ids, getCategoryIdsFromCategory(category.parent));
                }
                return ids;
            };
            const filterCategoryId = (product) => lodash_1.default.includes(lodash_1.default.flatMap(lodash_1.default.filter(this.categories, cat => lodash_1.default.includes(lodash_1.default.map(product.categories, 'id'), cat.id)), getCategoryIdsFromCategory), category.id);
            const trimVariants = (prod) => (Object.assign(Object.assign({}, prod), { variants: prod.variants.length > 0 ? [lodash_1.default.first(prod.variants)] : [] }));
            // remove all but the first variant since if this is for a category mapping
            let products = depth === 0 && !!((_a = context.args) === null || _a === void 0 ? void 0 : _a.includeProducts) ?
                lodash_1.default.take(lodash_1.default.filter(lodash_1.default.map(this.products, trimVariants), filterCategoryId), context.args.limit || 12) :
                [];
            // search for name matching 'query' if it was provided
            products = lodash_1.default.filter(products, prod => lodash_1.default.isEmpty(context.args.query) || prod.name.toLowerCase().indexOf(context.args.query.toLowerCase()) > -1);
            return Object.assign(Object.assign({}, category), { children: depth < 2 ? lodash_1.default.map(category.children, this.mapCategory(context, depth + 1)) : [], name: this.translations[category.name][`${context.language}-${context.country}`] || category.name, products: lodash_1.default.map(products, this.mapProduct(context)) });
        };
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[ rest-codec-${this.codecId} ] loading start...`);
            const startTime = new Date();
            let restConfig = this.config;
            this.products = yield (yield fetch(restConfig.productURL)).json();
            this.categories = yield (yield fetch(restConfig.categoryURL)).json();
            this.translations = yield (yield fetch(restConfig.translationsURL)).json();
            console.log(`[ rest-codec-${this.codecId} ] products loaded: ${this.products.length}`);
            console.log(`[ rest-codec-${this.codecId} ] categories loaded: ${this.categories.length}`);
            const duration = new Date().getTime() - startTime.getTime();
            console.log(`[ rest-codec-${this.codecId} ] loading duration: ${duration}`);
        });
    }
    // yes!
    getProduct(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = context.args.id && lodash_1.default.find(this.products, prod => context.args.id === prod.id) ||
                context.args.key && lodash_1.default.find(this.products, prod => context.args.key === prod.slug) ||
                context.args.sku && lodash_1.default.find(this.products, prod => lodash_1.default.map(prod.variants, 'sku').includes(context.args.sku));
            if (!product) {
                throw new Error(`Product not found for args: ${JSON.stringify(context.args)}`);
            }
            return this.mapProduct(context)(product);
        });
    }
    // yes!
    getProducts(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = context.args.productIds && lodash_1.default.filter(this.products, prod => context.args.productIds.split(',').includes(prod.id)) ||
                context.args.keyword && lodash_1.default.filter(this.products, prod => prod.name.toLowerCase().indexOf(context.args.keyword) > -1);
            if (!products) {
                throw new Error(`Products not found for args: ${JSON.stringify(context.args)}`);
            }
            return {
                meta: context.args.limit && {
                    limit: context.args.limit,
                    count: context.args.count,
                    offset: context.args.offset,
                    total: context.args.total
                },
                results: lodash_1.default.map(products, this.mapProduct(context))
            };
        });
    }
    // yes!
    getCategory(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = lodash_1.default.find(this.categories, cat => { var _a, _b; return ((_a = context.args) === null || _a === void 0 ? void 0 : _a.id) === cat.id || ((_b = context.args) === null || _b === void 0 ? void 0 : _b.key) === cat.slug; });
            if (!category) {
                throw new Error(`Category not found for args: ${JSON.stringify(context.args)}`);
            }
            return this.mapCategory(context)(category);
        });
    }
}
exports.RestCommerceCodec = RestCommerceCodec;
const type = {
    vendor: 'rest',
    codecType: 'commerce',
    validate: (config) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (((_a = config === null || config === void 0 ? void 0 : config._meta) === null || _a === void 0 ? void 0 : _a.schema) === 'https://amprsa.net/site/integration/rest') {
            let codec = new RestCommerceCodec(config);
            yield codec.start();
            return codec;
        }
        return undefined;
    }),
    create: (config) => {
        return new RestCommerceCodec(config);
    }
};
exports.default = type;
// register myself with codecManager
codec_manager_1.codecManager.registerCodecType(type);
