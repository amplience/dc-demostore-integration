"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCustomerGroup = exports.mapProduct = exports.mapVariant = exports.mapImage = exports.mapCategory = exports.mapPrice = void 0;
const util_1 = require("../../../../common/util");
/**
 * Extracts a Resource ID from a globally unique GraphQL ID.
 * @param id GUID
 * @returns Resource ID
 */
const extractID = (id) => {
    if (id == null) {
        return null;
    }
    const split = id.split('/');
    return split[split.length - 1];
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
 * Map a shopify image to the common image type.
 * @param image The shopify image
 * @returns The common image
 */
const mapImage = (image) => ({
    id: extractID(image.id),
    url: image.url,
    altText: image.altText
});
exports.mapImage = mapImage;
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
        id: extractID(variant.id),
        sku: variant.sku,
        listPrice: (0, exports.mapPrice)((_a = variant.price) !== null && _a !== void 0 ? _a : variant.unitPrice),
        salePrice: (0, exports.mapPrice)((_c = (_b = variant.compareAtPrice) !== null && _b !== void 0 ? _b : variant.price) !== null && _c !== void 0 ? _c : variant.unitPrice),
        attributes: attributes,
        images: [variant.image, ...sharedImages].map(exports.mapImage)
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
