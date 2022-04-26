"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const getCategoryIdsFromCategory = (category) => {
    let ids = [category.id];
    if (category.parent) {
        ids = lodash_1.default.concat(ids, getCategoryIdsFromCategory(category.parent));
    }
    return ids;
};
const translatePrice = (price, args) => new Intl.NumberFormat(args.locale, { style: 'currency', currency: args.currency }).format(parseFloat(price));
exports.default = {
    mapProduct: (product, args) => (Object.assign(Object.assign({}, product), { imageSetId: product.variants[0].attributes['articleNumberMax'] || '', variants: product.variants.map(variant => (Object.assign(Object.assign({}, variant), { listPrice: variant.prices.list && translatePrice(variant.prices.list, args) || '', salePrice: variant.prices.sale && translatePrice(variant.prices.sale, args) || '' }))) })),
    mapCategory: (category) => (Object.assign(Object.assign({}, category), { key: category.slug }))
};
