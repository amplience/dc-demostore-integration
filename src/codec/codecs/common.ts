import { CONSTANTS, CodecType } from '../..'
import { ContentType, ContentTypeSchema, ValidationLevel } from 'dc-management-sdk-js'
import _, { Dictionary } from 'lodash'
import { Category } from '../../common/types'

/**
 * TODO
 * @param categories 
 * @param slug 
 * @returns 
 */
export const findInMegaMenu = (categories: Category[], slug: string) => {
	return flattenCategories(categories).find(category => category.slug?.toLowerCase() === slug?.toLowerCase())
}

/**
 * TODO
 * @param categories 
 * @returns 
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
 * TODO
 */
export interface CTypeSchema {
    definitions?: any
    properties: any
}

/**
 * TODO
 */
export interface CType {
    label: string
    schemaUri: string
    iconUrl: string
    schema: CTypeSchema
}

/**
 * TODO
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
 * TODO
 * @param ctype 
 * @returns 
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
 * TODO
 * @param ctype 
 * @returns 
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