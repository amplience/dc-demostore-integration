import { Category } from "../../types";

const findInMegaMenu = (categories: Category[], slug: string) => {
    let allCategories = flattenCategories(categories)
    return allCategories.find(category => category.slug.toLowerCase() === slug.toLowerCase())
}

const flattenCategories = (categories: Category[]) => {
    const allCategories: Category[] = []
    const bulldozeCategories = cat => {
        allCategories.push(cat)
        cat.children.forEach(bulldozeCategories)
    }
    categories.forEach(bulldozeCategories)
    return allCategories
}

export { findInMegaMenu, flattenCategories }