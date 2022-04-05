"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInMegaMenu = void 0;
const findInMegaMenu = (categories, slug) => {
    const allCategories = [];
    const bulldozeCategories = cat => {
        allCategories.push(cat);
        cat.children.forEach(bulldozeCategories);
    };
    categories.forEach(bulldozeCategories);
    return allCategories.find(category => category.slug.toLowerCase() === slug.toLowerCase());
};
exports.findInMegaMenu = findInMegaMenu;
