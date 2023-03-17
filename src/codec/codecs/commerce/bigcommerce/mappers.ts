import { formatMoneyString } from '../../../../common/util'
import slugify from 'slugify'
import { Category, CustomerGroup, Product, Variant } from '../../../../common/types'
import { BigCommerceCategory, BigCommerceCustomerGroup, BigCommerceProduct, BigCommerceVariant } from './types'
import _ from 'lodash'

/**
 * Map a bigcommerce category to the common category type.
 * @param category The bigcommerce category
 * @returns The common category
 */
export const mapCategory = (category: BigCommerceCategory): Category => {
	return {
		id: `${category.id}`,
		name: category.name,
		slug: slugify(category.name, { lower: true }),
		children: category.children.map(mapCategory),
		products: []
	}
}

/**
 * Map a bigcommerce product variant to the common product variant type.
 * @param variant The bigcommerce product variant
 * @param product The bigcommerce product
 * @returns The common variant
 */
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

/**
 * Map a bigcommerce product to the common product variant type.
 * @param product The bigcommerce product
 * @returns The common variant
 */
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

/**
 * Map a bigcommerce product to the common product type
 * @param product The bigcommerce product
 * @returns The common product
 */
export const mapProduct = (product: BigCommerceProduct): Product => {
	return product && {
		id: `${product.id}`,
		shortDescription: product.description,
		longDescription: product.description,
		slug: slugify(product.name, { lower: true }),
		name: product.name,
		categories: [],
		variants: product.variants?.map(variant => mapVariant(variant, product)) || [mapVariantProduct(product)]
	}
}

/**
 * Map a bigcommerce customer group to the common customer group type
 * @param group The bigcommerce customer group
 * @returns The common customer group
 */
export const mapCustomerGroup = (group: BigCommerceCustomerGroup): CustomerGroup => ({
	id: `${group.id}`,
	name: group.name
})