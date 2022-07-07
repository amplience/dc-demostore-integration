import { CONSTANTS } from "../../index";
import { ContentType, ContentTypeSchema, ValidationLevel } from "dc-management-sdk-js";
import _ from "lodash";
import { Category } from "../../common/types";
import { CodecType } from "../../index";

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
        cat?.children?.forEach(bulldozeCategories)
    }
    categories.forEach(bulldozeCategories)
    return allCategories
}

export const getContentTypeSchema = (codec: CodecType): ContentTypeSchema => {
    let schema = new ContentTypeSchema()
    let schemaUri = `${CONSTANTS.demostoreIntegrationUri}/${codec.vendor}`
    schema.schemaId = schemaUri
    schema.validationLevel = ValidationLevel.CONTENT_TYPE
    schema.body = JSON.stringify({
        id: schemaUri,
        title: `${codec.vendor} integration`,
        description: `${codec.vendor} integration`,
        allOf: [{ "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content" }],
        type: "object",
        properties: {
            ...codec.properties,
            vendor: {
                type: 'string',
                title: 'vendor',
                const: codec.vendor
            }
        },
        propertyOrder: Object.keys(codec.properties)
    })
    return schema
}

export const getContentType = (codec: CodecType): ContentType => {
    let contentType = new ContentType()
    let schemaUri = `${CONSTANTS.demostoreIntegrationUri}/${codec.vendor}`
    contentType.contentTypeUri = schemaUri
    contentType.settings = {
        label: `${codec.vendor} integration`,
        icons: [{
            size: 256,
            url: `https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/${codec.vendor}.png`
        }]
    }
    return contentType
}