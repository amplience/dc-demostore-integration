import { CONSTANTS } from '../../common/constants'
import { ContentType, ContentTypeSchema, ValidationLevel } from 'dc-management-sdk-js'
import _, { Dictionary } from 'lodash'
import { Category, Identifiable } from '../../common/types'
import { env } from 'process'
import { CodecError, CodecErrorType } from './codec-error'

/**
 * Find a category in the mega menu by slug.
 * @param categories Root categories in mega menu
 * @param slug Category slug
 * @returns Found category, if present
 */
export const findInMegaMenu = (categories: Category[], slug: string) => {
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
 * Amplience Content Type Schema Template
 */
export interface CTypeSchema {
    definitions?: any
    properties: any
}

/**
 * Amplience Content Type Template
 */
export interface CType {
    label: string
    schemaUri: string
    iconUrl: string
    schema: CTypeSchema
}

/**
 * Demostore Content Types for Amplience
 */
export const CTypes: Dictionary<CType> = {
	demostoreconfig: {
		label: 'demostore config',
		schemaUri: CONSTANTS.demostoreConfigUri,
		iconUrl: 'https://cdn-icons-png.flaticon.com/512/627/627495.png',
		schema: {
			properties: {
				url: {
					title: 'App deployment URL',
					type: 'string',
					minLength: 0,
					maxLength: 200
				},
				algolia: {
					title: 'Algolia configuration',
					type: 'object',
					allOf: [{ $ref: 'https://demostore.amplience.com/site/integration/algolia#/definitions/config' }]
				},
				cms: {
					title: 'Amplience configuration',
					type: 'object',
					allOf: [{ $ref: 'https://demostore.amplience.com/site/integration/amplience#/definitions/config' }]
				},
				commerce: {
					title: 'Commerce integration',
					allOf: [
						{ $ref: 'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference' },
						{
							'properties': {
								'contentType': {
									'enum': [
										'https://demostore.amplience.com/site/integration/rest'
									]
								}
							}
						}
					]
				}
			}
		}
	},
	rest: {
		label: 'generic rest commerce configuration',
		schemaUri: `${CONSTANTS.demostoreIntegrationUri}/rest`,
		iconUrl: '',
		schema: { properties: {} }
	},
	automation: {
		label: 'demostore automation',
		schemaUri: 'https://demostore.amplience.com/site/automation',
		iconUrl: 'https://cdn-icons-png.flaticon.com/512/3662/3662817.png',
		schema: { properties: {} }
	}
}

/**
 * Get an Amplience Content Type representing the given CType.
 * @param ctype Content Type Template
 * @returns Amplience Content Type
 */
export const getContentType = (ctype: CType): ContentType => {
	const contentType = new ContentType()
	contentType.contentTypeUri = ctype.schemaUri
	contentType.settings = {
		label: ctype.label,
		icons: [{
			size: 256,
			url: ctype.iconUrl
		}]
	}
	return contentType
}

/**
 * Get an Amplience Content Type Schema representing the given CType.
 * @param ctype Content Type Template
 * @returns Amplience Content Type Schema
 */
export const getContentTypeSchema = (ctype: CType): ContentTypeSchema => {
	const schema = new ContentTypeSchema()
	schema.schemaId = schema.id = ctype.schemaUri
	schema.validationLevel = ValidationLevel.CONTENT_TYPE
	schema.body = JSON.stringify({
		id: ctype.schemaUri,
		title: ctype.label,
		description: ctype.label,
		allOf: [{ '$ref': 'http://bigcontent.io/cms/schema/v1/core#/definitions/content' }],
		type: 'object',
		properties: ctype.schema.properties,
		propertyOrder: Object.keys(ctype.schema.properties)
	})
	return schema
}

/**
 * Ensures a given array of identifiable objects has matching position to a list of IDs.
 * Missing items are replaced with null.
 * @param ids List of IDs
 * @param items List of items
 */
export const mapIdentifiers = <T extends {id: string}>(ids: string[], items: T[]): (T | null)[] => {
	return ids.map(id => items.find(item => item.id === id) ?? null)
}

export const mapIdentifiersNumber = <T extends {id: number}>(ids: string[], items: T[]): (T | null)[] => {
	console.log('IDS',ids)
	console.log('ITEMS',items)
	return ids.map(id => items.find(item => item && item.id === Number(id)) ?? null)
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