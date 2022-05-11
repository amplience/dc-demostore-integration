import { Product, Category, CommonArgs } from "../../../types"
import _ from "lodash"

const getCategoryIdsFromCategory = (category: Category): string[] => {
    let ids = [category.id]
    if (category.parent) {
        ids = _.concat(ids, getCategoryIdsFromCategory(category.parent))
    }
    return ids
}

const translatePrice = (price: string, args: CommonArgs) =>
    new Intl.NumberFormat(args.locale, { style: 'currency', currency: args.currency }).format(parseFloat(price))

export default {
    mapProduct: (product: Product, args: CommonArgs) => ({
        ...product,
        variants: product.variants.map(variant => ({
            ...variant,
            listPrice: translatePrice(variant.listPrice, args) || '',
            salePrice: translatePrice(variant.salePrice, args) || ''
        }))
    }),

    mapCategory: (category: Category) => ({
        ...category,
        key: category.slug
    })
}