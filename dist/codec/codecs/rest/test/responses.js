"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = exports.restProduct = exports.groups = exports.categories = exports.childCategories = exports.rootCategory = void 0;
exports.rootCategory = {
    id: 'root',
    name: 'root',
    slug: 'root-cat',
    parent: null,
    image: {
        url: 'root-image'
    },
    children: [],
    products: [],
};
exports.childCategories = [{
        id: 'child1',
        name: 'child1',
        slug: 'child1-cat',
        parent: exports.rootCategory,
        image: {
            url: 'child1-image'
        },
        children: [],
        products: [],
    },
    {
        id: 'child2',
        name: 'child2',
        slug: 'child2-cat',
        parent: exports.rootCategory,
        image: {
            url: 'child2-image'
        },
        children: [],
        products: [],
    }];
exports.rootCategory.children = exports.childCategories;
exports.categories = [
    exports.rootCategory,
    ...exports.childCategories
];
exports.groups = [
    {
        id: 'group-1',
        name: 'group-1'
    },
    {
        id: 'group-2',
        name: 'group-2'
    }
];
const restProduct = (id, label, category) => ({
    id: id,
    name: label,
    slug: id,
    shortDescription: `${label} short description.`,
    longDescription: `${label} long description.`,
    imageSetId: `${id}-image`,
    categories: [category],
    variants: []
});
exports.restProduct = restProduct;
exports.products = [
    (0, exports.restProduct)('rootProduct', 'A product in the root', exports.rootCategory),
    (0, exports.restProduct)('catProduct1', 'A product in the first category', exports.childCategories[0]),
    (0, exports.restProduct)('catProduct2', 'A second product in the first category', exports.childCategories[0]),
    (0, exports.restProduct)('cat2Product1', 'A product in the second category', exports.childCategories[1]),
    (0, exports.restProduct)('cat2Product2', 'A second product in the second category', exports.childCategories[1]),
    (0, exports.restProduct)('cat2Product3', 'A third product in the second category', exports.childCategories[1])
];
