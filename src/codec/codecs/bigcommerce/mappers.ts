import { formatMoneyString } from "../../../util"
import slugify from "slugify"
import { Category, CustomerGroup, Product, Variant } from "../../../types"
import { BigCommerceCategory, BigCommerceCustomerGroup, BigCommerceProduct, BigCommerceVariant } from "./types"
import _ from "lodash"

export const mapCategory = (category: BigCommerceCategory): Category => {
    return {
        id: `${category.id}`,
        name: category.name,
        slug: slugify(category.name, { lower: true }),
        children: category.children.map(mapCategory),
        products: []
    }
}

export const mapVariant = (variant: BigCommerceVariant, product: BigCommerceProduct): Variant => {
    return {
        sku: `${variant.sku}`,
        listPrice: formatMoneyString(variant.calculated_price, { currency: 'USD' }),
        salePrice: formatMoneyString(variant.sale_price, { currency: 'USD' }),
        // attributesx: variant.option_values.map(opt => ({
        //     name: opt.option_display_name.toLowerCase(),
        //     value: opt.label
        // })),
        // attributes: _.keyBy(variant.option_values, ''),
        attributes: {},
        images: variant.image_url ? [{ url: variant.image_url }] : product.images?.map(i => ({ url: i.url_standard }))
    }
}

export const mapVariantProduct = (product: BigCommerceProduct): Variant => {
    return {
        sku: `${product.sku}`,
        listPrice: formatMoneyString(product.calculated_price, { currency: 'USD' }),
        salePrice: formatMoneyString(product.sale_price, { currency: 'USD' }),
        // attributesx: variant.option_values.map(opt => ({
        //     name: opt.option_display_name.toLowerCase(),
        //     value: opt.label
        // })),
        // attributes: _.keyBy(variant.option_values, ''),
        attributes: {},
        images: product.images?.map(i => ({ url: i.url_standard }))
    }
}

export const mapProduct = (product: BigCommerceProduct): Product => {
    return {
        id: `${product.id}`,
        shortDescription: product.description,
        longDescription: product.description,
        slug: slugify(product.name, { lower: true }),
        name: product.name,
        categories: [],
        variants: product.variants?.map(variant => mapVariant(variant, product)) || [mapVariantProduct(product)]
    }
}

export const mapCustomerGroup = (group: BigCommerceCustomerGroup): CustomerGroup => ({
    id: `${group.id}`,
    name: group.name
})