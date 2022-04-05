import { QueryContext, Variant, Product, Category } from "../../../types"
import _ from "lodash"

const getCategoryIdsFromCategory = (category: Category): string[] => {
    let ids = [category.id]
    if (category.parent) {
        ids = _.concat(ids, getCategoryIdsFromCategory(category.parent))
    }
    return ids
}

const getAttribute = (variant: Variant, attributeName: string, defaultValue: string) => _.get(_.find(variant.attributes, att => att.name === attributeName), 'value') || defaultValue

const translatePrice = (price: string, context: QueryContext) =>
    new Intl.NumberFormat(context.getLocale(), { style: 'currency', currency: context.currency }).format(parseFloat(price))

export default {
    mapProduct: (product: Product, context: QueryContext) => ({
        ...product,
        imageSetId: getAttribute(product.variants[0], 'articleNumberMax', ''),
        variants: product.variants.map(variant => ({
            ...variant,
            articleNumberMax: getAttribute(variant, 'articleNumberMax', ''),
            size: getAttribute(variant, 'size', ''),
            color: getAttribute(variant, 'color', ''),
            listPrice: variant.prices.list && translatePrice(variant.prices.list, context) || '',
            salePrice: variant.prices.sale && translatePrice(variant.prices.sale, context) || ''
        }))
    }),

    mapCategory: (category: Category) => ({
        ...category,
        key: category.slug
    })
}