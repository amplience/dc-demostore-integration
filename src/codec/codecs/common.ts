import _ from 'lodash'
import { Category } from '../../common/types'
import { env } from 'process'
import { CodecError, CodecErrorType } from './codec-error'

/**
 * Find a category in the category tree by slug.
 * @param categories Root categories in category tree
 * @param slug Category slug
 * @returns Found category, if present
 */
export const findInCategoryTree = (categories: Category[], slug: string) => {
	return flattenCategories(categories).find(category => category.slug?.toLowerCase() === slug?.toLowerCase())
}

/**
 * Flattens categories to a single dimensional array, rather than a tree
 * @param categories Root categories
 * @returns Flattened list of categories
 */
export const flattenCategories = (categories: Category[]) => {
	const allCategories: Category[] = []
	const bulldozeCategories = cat => {
		allCategories.push(cat)
		cat?.children?.forEach(bulldozeCategories)
	}
	categories.forEach(bulldozeCategories)
	return allCategories
}

/**
 * Helper method for logging requests/responses when the LOG_INTEGRATION environment variable is set.
 * @param response Response
 */
export const logResponse = <T>(method: string, request: string, response: T): T => {
	if (env.LOG_INTEGRATION) {
		console.log('============== REQUEST ==============')
		console.log(`${method.toUpperCase()} ${request}`)
		console.log('============== RESPONSE ==============')
		console.log(JSON.stringify(response, null, 4))
	}

	return response
}

/**
 * Ensures a given array of identifiable objects has matching position to a list of IDs.
 * Missing items are replaced with null.
 * @param ids List of IDs
 * @param items List of items
 * @returns Items in the order of the specified ID list
 */
export const mapIdentifiers = <T extends {id: string | number}>(ids: (string | number)[], items: T[]): (T | null)[] => {
	return ids.map(id => items.find(item => item && item.id == id) ?? null)
}

/**
 * Construct a CodecError for when get products arguments are missing
 * @param method Method name
 * @returns Codec error
 */
export const getProductsArgError = (method: string) => {
	return new CodecError(
		CodecErrorType.IncorrectArguments,
		{ message: `${method} requires either: productIds, keyword, or category reference.` }
	)
}