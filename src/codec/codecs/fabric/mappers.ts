import { Category, Product } from "../../../common/types";
import slugify from "slugify";
import { Attribute, FabricCategory, FabricProduct } from "./types";
import _ from "lodash";

export const mapCategory = (category: FabricCategory): Category => ({
    id: category.id,
    slug: slugify(category.name, { lower: true }),
    name: category.name,
    children: category.children.map(mapCategory),
    products: []
})

export const mapProduct = (product: FabricProduct): Product => {
    const getAttributeValue = name => product.attributes.find(att => att.name === name).value
    let name = getAttributeValue('title')
    return {
        id: product._id,
        name,
        longDescription: getAttributeValue('description'),
        slug: slugify(name, { lower: true }),
        categories: [],
        variants: [{
            sku: product.sku,
            listPrice: '--',
            salePrice: '--',
            images: [
                { url: getAttributeValue('Image 1') },
                ...JSON.parse(getAttributeValue('ImageArray'))
            ],
            attributes: _.zipObject(_.map(product.attributes, 'name'), _.map(product.attributes, 'value'))
        }]
    }
}