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
const translatePrice = (price, context) => new Intl.NumberFormat(context.locale, { style: 'currency', currency: context.currency }).format(parseFloat(price));
exports.default = {
    mapProduct: (product, context) => (Object.assign(Object.assign({}, product), { imageSetId: product.variants[0].attributes['articleNumberMax'] || '', variants: product.variants.map(variant => (Object.assign(Object.assign({}, variant), { listPrice: variant.listPrice && translatePrice(variant.listPrice, context) || '', salePrice: variant.salePrice && translatePrice(variant.salePrice, context) || '' }))) })),
    mapCategory: (category) => (Object.assign(Object.assign({}, category), { key: category.slug }))
};
