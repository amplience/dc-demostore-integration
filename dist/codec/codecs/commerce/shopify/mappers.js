"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCustomerGroup = exports.mapProduct = exports.mapVariant = exports.mapCategory = exports.mapPrice = exports.firstNonEmpty = void 0;
const util_1 = require("../../../../common/util");
/**
 * TODO
 * @param strings
 * @returns
 */
const firstNonEmpty = (strings) => {
    return strings.find(string => string !== '' && string != null);
};
exports.firstNonEmpty = firstNonEmpty;
/**
 * TODO
 * @param price
 * @returns
 */
const mapPrice = (price) => {
    return (0, util_1.formatMoneyString)(price.amount, { currency: price.currencyCode });
};
exports.mapPrice = mapPrice;
/**
 * TODO
 * @param collection
 * @returns
 */
const mapCategory = (collection) => {
    return {
        id: collection.id,
        slug: collection.handle,
        name: collection.title,
        image: collection.image,
        children: [],
        products: []
    };
};
exports.mapCategory = mapCategory;
/**
 * TODO
 * @param variant
 * @param sharedImages
 * @returns
 */
const mapVariant = (variant, sharedImages) => {
    var _a, _b, _c;
    const attributes = {};
    for (const option of variant.selectedOptions) {
        attributes[option.name] = option.value;
    }
    return {
        sku: (0, exports.firstNonEmpty)([variant.sku, variant.id]),
        listPrice: (0, exports.mapPrice)((_a = variant.price) !== null && _a !== void 0 ? _a : variant.unitPrice),
        salePrice: (0, exports.mapPrice)((_c = (_b = variant.compareAtPrice) !== null && _b !== void 0 ? _b : variant.price) !== null && _c !== void 0 ? _c : variant.unitPrice),
        attributes: attributes,
        images: [variant.image, ...sharedImages]
    };
};
exports.mapVariant = mapVariant;
/**
 * TODO
 * @param product
 * @returns
 */
const mapProduct = (product) => {
    const sharedImages = product.images.edges.filter(image => product.variants.edges.findIndex(variant => variant.node.image.id === image.node.id) === -1).map(edge => edge.node);
    return {
        id: product.id,
        name: product.title,
        slug: product.handle,
        categories: product.collections.edges.map(collection => (0, exports.mapCategory)(collection.node)),
        variants: product.variants.edges.map(variant => (0, exports.mapVariant)(variant.node, sharedImages)),
        shortDescription: product.description,
        longDescription: product.description
    };
};
exports.mapProduct = mapProduct;
/**
 * TODO
 * @param segment
 * @returns
 */
const mapCustomerGroup = (segment) => {
    return {
        id: segment.id,
        name: segment.name
    };
};
exports.mapCustomerGroup = mapCustomerGroup;
