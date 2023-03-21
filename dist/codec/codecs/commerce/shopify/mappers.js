"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCustomerGroup = exports.mapProduct = exports.mapVariant = exports.mapCategory = exports.mapPrice = exports.firstNonEmpty = void 0;
const util_1 = require("../../../../common/util");
/**
 * Find the first non-empty (not null or length 0) string in a list of strings.
 * @param strings List of strings to search
 * @returns The first non-empty string in the list
 */
const firstNonEmpty = (strings) => {
    return strings.find(string => string !== '' && string != null);
};
exports.firstNonEmpty = firstNonEmpty;
/**
 * Extracts a Resource ID from a globally unique GraphQL ID.
 * @param id GUID
 * @returns Resource ID
 */
const extractID = (id) => {
    return id.split('/').at(-1);
};
/**
 * Map a shopify price to the common price type.
 * @param price The shopify price
 * @returns The common price
 */
const mapPrice = (price) => {
    return (0, util_1.formatMoneyString)(price.amount, { currency: price.currencyCode });
};
exports.mapPrice = mapPrice;
/**
 * Map a shopify collection to the common category type.
 * @param collection The shopify collection
 * @returns The common category
 */
const mapCategory = (collection) => {
    return {
        id: extractID(collection.id),
        slug: collection.handle,
        name: collection.title,
        image: collection.image,
        children: [],
        products: []
    };
};
exports.mapCategory = mapCategory;
/**
 * Map a shopify product variant to the common product variant type.
 * @param variant The shopify product variant
 * @param sharedImages Images shared between each variant
 * @returns The common variant
 */
const mapVariant = (variant, sharedImages) => {
    var _a, _b, _c;
    const attributes = {};
    for (const option of variant.selectedOptions) {
        attributes[option.name] = option.value;
    }
    return {
        sku: (0, exports.firstNonEmpty)([variant.sku, extractID(variant.id)]),
        listPrice: (0, exports.mapPrice)((_a = variant.price) !== null && _a !== void 0 ? _a : variant.unitPrice),
        salePrice: (0, exports.mapPrice)((_c = (_b = variant.compareAtPrice) !== null && _b !== void 0 ? _b : variant.price) !== null && _c !== void 0 ? _c : variant.unitPrice),
        attributes: attributes,
        images: [variant.image, ...sharedImages]
    };
};
exports.mapVariant = mapVariant;
/**
 * Map a shopify product to the common product type.
 * @param product The shopify product
 * @returns The common product
 */
const mapProduct = (product) => {
    if (product == null)
        return null;
    const sharedImages = product.images.edges.filter(image => product.variants.edges.findIndex(variant => variant.node.image.id === image.node.id) === -1).map(edge => edge.node);
    return {
        id: extractID(product.id),
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
 * Map a shopify segment to the common customer group type
 * @param segment The shopify segment
 * @returns The common customer group
 */
const mapCustomerGroup = (segment) => {
    return {
        id: extractID(segment.id),
        name: segment.name
    };
};
exports.mapCustomerGroup = mapCustomerGroup;
