import { Category, CustomerGroup, Product, Variant } from "../../../../common/types"
import { formatMoneyString } from "../../../../common/util"
import { 
	ShopifyCollection, 
	ShopifyImage, 
	ShopifyPrice, 
	ShopifyProduct, 
	ShopifySegment, 
	ShopifyVariant 
} from "./types"
import { Dictionary } from "lodash"

/**
 * TODO
 * @param strings 
 * @returns 
 */
export const firstNonEmpty = (strings: string[]) => {
	return strings.find(string => string !== '' && string != null)
}

/**
 * TODO
 * @param price 
 * @returns 
 */
export const mapPrice = (price: ShopifyPrice): string => {
	return formatMoneyString(price.amount, { currency: price.currencyCode })
}

/**
 * TODO
 * @param collection 
 * @returns 
 */
export const mapCategory = (collection: ShopifyCollection): Category => {
	return {
		id: collection.id,
		slug: collection.handle,
		name: collection.title,
		image: collection.image,
		children: [],
		products: []
	}
}

/**
 * TODO
 * @param variant 
 * @param sharedImages 
 * @returns 
 */
export const mapVariant = (variant: ShopifyVariant, sharedImages: ShopifyImage[]): Variant => {
	const attributes: Dictionary<string> = {}

	for (const option of variant.selectedOptions) {
		attributes[option.name] = option.value
	}
	
	return {
		sku: firstNonEmpty([variant.sku, variant.id]),
		listPrice: mapPrice(variant.price ?? variant.unitPrice),
		salePrice: mapPrice(variant.compareAtPrice ?? variant.price ?? variant.unitPrice),
		attributes: attributes,
		images: [variant.image, ...sharedImages]
	}
}

/**
 * TODO
 * @param product 
 * @returns 
 */
export const mapProduct = (product: ShopifyProduct): Product => {
	const sharedImages = product.images.edges.filter(image => 
		product.variants.edges.findIndex(variant => variant.node.image.id === image.node.id) === -1
	).map(edge => edge.node)

	return {
		id: product.id,
		name: product.title,
		slug: product.handle,
		categories: product.collections.edges.map(collection => mapCategory(collection.node)),
		variants: product.variants.edges.map(variant => mapVariant(variant.node, sharedImages)),
		shortDescription: product.description,
		longDescription: product.description
	}
}

/**
 * TODO
 * @param segment 
 * @returns 
 */
export const mapCustomerGroup = (segment: ShopifySegment): CustomerGroup => {
	return {
		id: segment.id,
		name: segment.name
	}
}