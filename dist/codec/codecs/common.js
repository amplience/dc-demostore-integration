"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenCategories = exports.findInMegaMenu = void 0;
const findInMegaMenu = (categories, slug) => {
    let allCategories = flattenCategories(categories);
    return allCategories.find(category => category.slug.toLowerCase() === slug.toLowerCase());
};
exports.findInMegaMenu = findInMegaMenu;
const flattenCategories = (categories) => {
    const allCategories = [];
    const bulldozeCategories = cat => {
        allCategories.push(cat);
        cat.children.forEach(bulldozeCategories);
    };
    categories.forEach(bulldozeCategories);
    return allCategories;
};
exports.flattenCategories = flattenCategories;
