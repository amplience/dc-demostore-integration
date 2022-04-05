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
const getAttribute = (variant, attributeName, defaultValue) => lodash_1.default.get(lodash_1.default.find(variant.attributes, att => att.name === attributeName), 'value') || defaultValue;
const translatePrice = (price, context) => new Intl.NumberFormat(context.getLocale(), { style: 'currency', currency: context.currency }).format(parseFloat(price));
exports.default = {
    mapProduct: (product, context) => (Object.assign(Object.assign({}, product), { imageSetId: getAttribute(product.variants[0], 'articleNumberMax', ''), variants: product.variants.map(variant => (Object.assign(Object.assign({}, variant), { articleNumberMax: getAttribute(variant, 'articleNumberMax', ''), size: getAttribute(variant, 'size', ''), color: getAttribute(variant, 'color', ''), listPrice: variant.prices.list && translatePrice(variant.prices.list, context) || '', salePrice: variant.prices.sale && translatePrice(variant.prices.sale, context) || '' }))) })),
    mapCategory: (category) => (Object.assign(Object.assign({}, category), { key: category.slug }))
};
