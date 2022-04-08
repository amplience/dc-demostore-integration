import { QueryContext, Variant, Product, Category } from "../../../types"
import _ from "lodash"

const getCategoryIdsFromCategory = (category: Category): string[] => {
    let ids = [category.id]
    if (category.parent) {
        ids = _.concat(ids, getCategoryIdsFromCategory(category.parent))
    }
    return ids
}

const translatePrice = (price: string, context: QueryContext) =>
    new Intl.NumberFormat(context.locale, { style: 'currency', currency: context.currency }).format(parseFloat(price))

export default {
    mapProduct: (product: Product, context: QueryContext) => ({
        ...product,
        imageSetId: product.variants[0].attributes['articleNumberMax'] || '',
        variants: product.variants.map(variant => ({
            ...variant,
            listPrice: variant.listPrice && translatePrice(variant.listPrice, context) || '',
            salePrice: variant.salePrice && translatePrice(variant.salePrice, context) || ''
        }))
    }),

    mapCategory: (category: Category) => ({
        ...category,
        key: category.slug
    })
}