import { formatMoneyString } from "../../../common/util";
import _ from "lodash";
import slugify from "slugify";
import { Category, CommonArgs, Product } from "../../../common/types";
import { AkeneoCategory, AkeneoProduct, AkeneoProperty } from "./types";
import { defaultArgs } from "../../../codec";

export const mapCategory = (categories: AkeneoCategory[]) => (category: AkeneoCategory): Category => ({
    id: category.code,
    name: category.labels['en_US'],
    slug: category.code,
    children: categories.filter(cat => cat.parent === category.code).map(mapCategory(categories)),
    products: []
})

const findValue = (values: AkeneoProperty[]) => values && values.find(value => !value.locale || value.locale === 'en_US')?.data

export const mapProduct = (args: CommonArgs) => (product: AkeneoProduct): Product => {
    const prices = findValue(product.values.price)
    let price = '--'

    if (prices) {
        let locationPrice = prices.find(p => p.currency === args.currency || defaultArgs.currency)
        if (locationPrice) {
            price = formatMoneyString(locationPrice.amount, args)
        }
    }

    return {
        id: product.identifier,
        name: findValue(product.values.name),
        slug: product.values.name && slugify(findValue(product.values.name), { lower: true }),
        shortDescription: findValue(product.values.description),
        longDescription: findValue(product.values.description),
        categories: [],
        variants: [{
            sku: product.identifier,
            listPrice: price,
            salePrice: price,
            // images: [],
            images: [{ url: `https://assets.ellosgroup.com/s/ellos/ell_${product.identifier}_MS` }],
            attributes: _.mapValues(product.values, findValue)
        }]
    }
}
