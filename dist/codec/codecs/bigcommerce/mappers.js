"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProduct = exports.mapCategory = void 0;
const util_1 = require("../../../util");
const slugify_1 = __importDefault(require("slugify"));
const mapCategory = (category) => {
    return {
        id: `${category.id}`,
        name: category.name,
        key: (0, slugify_1.default)(category.name, { lower: true }),
        slug: (0, slugify_1.default)(category.name, { lower: true }),
        children: category.children.map(exports.mapCategory),
        products: []
    };
};
exports.mapCategory = mapCategory;
const mapProduct = (product) => {
    return {
        id: `${product.id}`,
        shortDescription: product.description,
        longDescription: product.description,
        key: (0, slugify_1.default)(product.name, { lower: true }),
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        name: product.name,
        categories: [],
        variants: product.variants.map((variant) => {
            return {
                id: `${variant.id}`,
                key: `${variant.id}`,
                sku: `${variant.id}`,
                listPrice: `${variant.calculated_price}`,
                salePrice: `${variant.sale_price}`,
                prices: {
                    list: (0, util_1.formatMoneyString)(variant.price || product.price),
                    sale: (0, util_1.formatMoneyString)(variant.sale_price || product.price)
                },
                attributes: variant.option_values.map(opt => ({
                    name: opt.option_display_name.toLowerCase(),
                    value: opt.label
                })),
                images: variant.image_url ? [{ url: variant.image_url }] : product.images.map(i => ({ url: i.url_standard }))
            };
        })
    };
};
exports.mapProduct = mapProduct;
