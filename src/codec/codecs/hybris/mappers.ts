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
        imageSetId: product.variants[0].attributes['articleNumberMax'] || '',
        variants: product.variants.map(variant => ({
            ...variant,
            listPrice: (variant as any).prices.list && translatePrice((variant as any).prices.list, args) || '',
            salePrice: (variant as any).prices.sale && translatePrice((variant as any).prices.sale, args) || ''
        }))
    }),

    mapCategory: (category: Category) => ({
        ...category,
        key: category.slug
    })
}