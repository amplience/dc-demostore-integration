import { CONSTANTS } from "../../index";
import { ContentType, ContentTypeSchema, ValidationLevel } from "dc-management-sdk-js";
import _ from "lodash";
import { GenericCodec } from "..";
import { Category } from "../../common/types";

/**
 * @deprecated The method should not be used
 */
export const findInMegaMenu = (categories: Category[], slug: string) => {
    return flattenCategories(categories).find(category => category.slug?.toLowerCase() === slug?.toLowerCase())
}

/**
 * @deprecated The method should not be used
 */
export const flattenCategories = (categories: Category[]) => {
    const allCategories: Category[] = []
    const bulldozeCategories = cat => {
        allCategories.push(cat)
        cat.children && cat.children.forEach(bulldozeCategories)
    }
    categories.forEach(bulldozeCategories)
    return allCategories
}

export const getContentTypeSchema = (codec: GenericCodec): ContentTypeSchema => {
    let schema = new ContentTypeSchema()
    let schemaUri = `${CONSTANTS.demostoreIntegrationUri}/${codec.metadata.vendor}`
    schema.schemaId = schemaUri
    schema.validationLevel = ValidationLevel.CONTENT_TYPE
    schema.body = JSON.stringify({
        id: schemaUri,
        title: `${codec.metadata.vendor} integration`,
        description: `${codec.metadata.vendor} integration`,
        allOf: [{ "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content" }],
        type: "object",
        properties: {
            ...codec.metadata.properties,
            vendor: {
                type: 'string',
                title: 'vendor',
                const: codec.metadata.vendor
            }
        },
        propertyOrder: Object.keys(codec.metadata.properties)
    })
    return schema
}

export const getContentType = (codec: GenericCodec): ContentType => {
    let contentType = new ContentType()
    let schemaUri = `${CONSTANTS.demostoreIntegrationUri}/${codec.metadata.vendor}`
    contentType.contentTypeUri = schemaUri
    contentType.settings = {
        label: `${codec.metadata.vendor} integration`,
        icons: [{
            size: 256,
            url: `https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/${codec.metadata.vendor}.png`
        }]
    }
    return contentType
}