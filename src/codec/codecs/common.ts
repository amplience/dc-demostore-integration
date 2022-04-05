import { Category } from "../../types";

const findInMegaMenu = (categories: Category[], slug: string) => {
    const allCategories: Category[] = []
    const bulldozeCategories = cat => {
        allCategories.push(cat)
        cat.children.forEach(bulldozeCategories)
    }
    categories.forEach(bulldozeCategories)
    return allCategories.find(category => category.slug.toLowerCase() === slug.toLowerCase())
}

export { findInMegaMenu }