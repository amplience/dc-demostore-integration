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
const __1 = require("..");
const util_1 = require("../../util");
const getAttribute = (variant, attributeName, defaultValue) => lodash_1.default.get(lodash_1.default.find(variant.attributes, att => att.name === attributeName), 'value') || defaultValue;
const getCategoryIdsFromCategory = (category) => {
    let ids = [category.id];
    if (category.parent) {
        ids = lodash_1.default.concat(ids, getCategoryIdsFromCategory(category.parent));
    }
    return ids;
};
let codec = undefined;
let loading_state = 0;
const topLevelCategorySlugs = ['women', 'men', 'accessories', 'new', 'sale'];
let allCategories = [];
const bulldozeCategories = cat => {
    allCategories.push(cat);
    lodash_1.default.each(cat.children, bulldozeCategories);
};
let categories = [];
let products = [];
let translations = {};
class RestCommerceCodec extends __1.Codec {
    constructor() {
        super(...arguments);
        this.filterCategoryId = (category) => (product) => lodash_1.default.includes(lodash_1.default.flatMap(lodash_1.default.filter(categories, cat => lodash_1.default.includes(lodash_1.default.map(product.categories, 'id'), cat.id)), getCategoryIdsFromCategory), category.id);
        this.translatePrice = (price, context) => new Intl.NumberFormat(context.getLocale(), { style: 'currency', currency: context.currency }).format(parseFloat(price));
        this.mapProduct = (context) => (product) => {
            product.imageSetId = getAttribute(product.variants[0], 'articleNumberMax', '');
            lodash_1.default.each(product.variants, (variant) => {
                variant.articleNumberMax = getAttribute(variant, 'articleNumberMax', '');
                variant.size = getAttribute(variant, 'size', '');
                variant.color = getAttribute(variant, 'color', '');
                // map currency code
                variant.listPrice = variant.prices.list && this.translatePrice(variant.prices.list, context) || '';
                variant.salePrice = variant.prices.sale && this.translatePrice(variant.prices.sale, context) || '';
            });
            return product;
        };
        this.mapCategory = (context, depth = 0) => (category) => {
            category.products = lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), category.id));
            return category;
        };
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[ rest-codec-${this.codecId} ] loading start...`);
            const startTime = new Date();
            products = yield (yield fetch(this.config.productURL)).json();
            categories = yield (yield fetch(this.config.categoryURL)).json();
            translations = yield (yield fetch(this.config.translationsURL)).json();
            // bulldoze the category array so we have them easily accessible
            lodash_1.default.each(categories, bulldozeCategories);
            allCategories = allCategories.map(category => (Object.assign(Object.assign({}, category), { products: lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), category.id)) })));
            console.log(`[ rest-codec-${this.codecId} ] products loaded: ${products.length}`);
            console.log(`[ rest-codec-${this.codecId} ] categories loaded: ${categories.length}`);
            console.log(`[ rest-codec-${this.codecId} ] loading duration: ${new Date().getTime() - startTime.getTime()}`);
        });
    }
    getProduct(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = context.args.id && lodash_1.default.find(products, prod => context.args.id === prod.id) ||
                context.args.key && lodash_1.default.find(products, prod => context.args.key === prod.slug) ||
                context.args.sku && lodash_1.default.find(products, prod => lodash_1.default.map(prod.variants, 'sku').includes(context.args.sku));
            if (!product) {
                throw new Error(`Product not found for args: ${JSON.stringify(context.args)}`);
            }
            return this.mapProduct(context)(product);
        });
    }
    getProducts(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtered = context.args.productIds && lodash_1.default.filter(products, prod => context.args.productIds.split(',').includes(prod.id)) ||
                context.args.keyword && lodash_1.default.filter(products, prod => prod.name.toLowerCase().indexOf(context.args.keyword) > -1) ||
                context.args.categoryId && lodash_1.default.filter(products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), context.args.categoryId));
            if (!filtered) {
                throw new Error(`Products not found for args: ${JSON.stringify(context.args)}`);
            }
            return lodash_1.default.map(filtered, this.mapProduct(context));
        });
    }
    getCategory(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = lodash_1.default.find(allCategories, cat => { var _a, _b; return ((_a = context.args) === null || _a === void 0 ? void 0 : _a.id) === cat.id || ((_b = context.args) === null || _b === void 0 ? void 0 : _b.key) === cat.slug; });
            if (!category) {
                throw new Error(`Category not found for args: ${JSON.stringify(context.args)}`);
            }
            return this.mapCategory(context)(category);
        });
    }
    getMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return categories;
        });
    }
    getCategories(context) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`[ aria ] RestCommerceCodec.getCategories() not yet implemented`);
        });
    }
}
const getInstance = (config) => __awaiter(void 0, void 0, void 0, function* () {
    if (codec && loading_state !== 1) {
        return codec;
    }
    else if (loading_state === 0) {
        loading_state = 1;
        codec = new RestCommerceCodec(config);
        yield codec.start();
        loading_state = 2;
        return codec;
    }
    yield util_1.sleep(100);
    return getInstance(config);
});
exports.default = {
    // codec generator conformance
    SchemaURI: 'https://amprsa.net/site/integration/rest',
    getInstance
    // end codec generator conformance
};
// registerCodec(RestCommerceCodec)
