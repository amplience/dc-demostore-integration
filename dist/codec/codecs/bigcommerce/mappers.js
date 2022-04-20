"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProduct = exports.mapCategory = void 0;
const slugify_1 = __importDefault(require("slugify"));
const mapCategory = (category) => {
    return {
        id: `${category.id}`,
        name: category.name,
        slug: (0, slugify_1.default)(category.name, { lower: true }),
        children: category.children.map(exports.mapCategory),
        products: []
    };
};
exports.mapCategory = mapCategory;
const mapProduct = (product) => {
    var _a;
    return {
        id: `${product.id}`,
        shortDescription: product.description,
        longDescription: product.description,
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        name: product.name,
        categories: [],
        variants: (_a = product.variants) === null || _a === void 0 ? void 0 : _a.map((variant) => {
            return {
                sku: `${variant.id}`,
                listPrice: `${variant.calculated_price}`,
                salePrice: `${variant.sale_price}`,
                // prices: {
                //     list: formatMoneyString(variant.price || product.price),
                //     sale: formatMoneyString(variant.sale_price || product.price)
                // },
                // attributesx: variant.option_values.map(opt => ({
                //     name: opt.option_display_name.toLowerCase(),
                //     value: opt.label
                // })),
                // attributes: _.keyBy(variant.option_values, ''),
                attributes: {},
                images: variant.image_url ? [{ url: variant.image_url }] : product.images.map(i => ({ url: i.url_standard }))
            };
        })
    };
};
exports.mapProduct = mapProduct;
