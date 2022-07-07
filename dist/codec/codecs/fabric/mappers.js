"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProduct = exports.mapCategory = void 0;
const slugify_1 = __importDefault(require("slugify"));
const lodash_1 = __importDefault(require("lodash"));
const mapCategory = (category) => ({
    id: category.id,
    slug: (0, slugify_1.default)(category.name, { lower: true }),
    name: category.name,
    children: category.children.map(exports.mapCategory),
    products: []
});
exports.mapCategory = mapCategory;
const mapProduct = (product) => {
    const getAttributeValue = name => product.attributes.find(att => att.name === name).value;
    let name = getAttributeValue('title');
    return {
        id: product._id,
        name,
        longDescription: getAttributeValue('description'),
        slug: (0, slugify_1.default)(name, { lower: true }),
        categories: [],
        variants: [{
                sku: product.sku,
                listPrice: '--',
                salePrice: '--',
                images: [
                    { url: getAttributeValue('Image 1') },
                    ...JSON.parse(getAttributeValue('ImageArray'))
                ],
                attributes: lodash_1.default.zipObject(lodash_1.default.map(product.attributes, 'name'), lodash_1.default.map(product.attributes, 'value'))
            }]
    };
};
exports.mapProduct = mapProduct;
