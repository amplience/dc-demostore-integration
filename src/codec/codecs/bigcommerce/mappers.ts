import { formatMoneyString } from "../../../util"
import slugify from "slugify"
import { Category, Product, Variant } from "../../../types"
import { BigCommerceCategory, BigCommerceProduct, BigCommerceVariant } from "./types"

export const mapCategory = (category: BigCommerceCategory): Category => {
    return {
        id: `${category.id}`,
        name: category.name,
        key: slugify(category.name, { lower: true }),
        slug: slugify(category.name, { lower: true }),
        children: category.children.map(mapCategory),
        products: []
    }
}

export const mapProduct = (product: BigCommerceProduct): Product => {
    return {
        id: `${product.id}`,
        shortDescription: product.description,
        longDescription: product.description,
        key: slugify(product.name, { lower: true }),
        slug: slugify(product.name, { lower: true }),
        name: product.name,
        categories: [],
        variants: product.variants.map((variant: BigCommerceVariant): Variant => {
            return {
                id: `${variant.id}`,
                key: `${variant.id}`,
                sku: `${variant.id}`,
                listPrice: `${variant.calculated_price}`,
                salePrice: `${variant.sale_price}`,
                prices: {
                    list: formatMoneyString(variant.price || product.price),
                    sale: formatMoneyString(variant.sale_price || product.price)
                },
                attributes: variant.option_values.map(opt => ({
                    name: opt.option_display_name.toLowerCase(),
                    value: opt.label
                })),
                images: variant.image_url ? [{ url: variant.image_url }] : product.images.map(i => ({ url: i.url_standard }))
            }
        })
    }
}
