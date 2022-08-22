"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProduct = exports.mapCategory = void 0;
const util_1 = require("../../../common/util");
const lodash_1 = __importDefault(require("lodash"));
const slugify_1 = __importDefault(require("slugify"));
const codec_1 = require("../../../codec");
const mapCategory = (categories) => (category) => ({
    id: category.code,
    name: category.labels['en_US'],
    slug: category.code,
    children: categories.filter(cat => cat.parent === category.code).map((0, exports.mapCategory)(categories)),
    products: []
});
exports.mapCategory = mapCategory;
const findValue = (values) => { var _a; return values && ((_a = values.find(value => !value.locale || value.locale === 'en_US')) === null || _a === void 0 ? void 0 : _a.data); };
const mapProduct = (args) => (product) => {
    const prices = findValue(product.values.price);
    let price = '--';
    if (prices) {
        let locationPrice = prices.find(p => p.currency === args.currency || codec_1.defaultArgs.currency);
        if (locationPrice) {
            price = (0, util_1.formatMoneyString)(locationPrice.amount, args);
        }
    }
    return {
        id: product.identifier,
        name: findValue(product.values.name),
        slug: product.values.name && (0, slugify_1.default)(findValue(product.values.name), { lower: true }),
        shortDescription: findValue(product.values.description),
        longDescription: findValue(product.values.description),
        categories: [],
        variants: [{
                sku: product.identifier,
                listPrice: price,
                salePrice: price,
                // images: [],
                images: [{ url: `https://assets.ellosgroup.com/s/ellos/ell_${product.identifier}_MS` }],
                attributes: lodash_1.default.mapValues(product.values, findValue)
            }]
    };
};
exports.mapProduct = mapProduct;
