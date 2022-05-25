import { ContentType, ContentTypeSchema, ValidationLevel } from "dc-management-sdk-js";
import _ from "lodash";
import { GenericCodec } from "..";
import { Category } from "../../common/types";

export const findInMegaMenu = (categories: Category[], slug: string) => {
    return flattenCategories(categories).find(category => category.slug?.toLowerCase() === slug?.toLowerCase())
}

export const flattenCategories = (categories: Category[]) => {
    const allCategories: Category[] = []
    const bulldozeCategories = cat => {
        allCategories.push(cat)
        cat.children.forEach(bulldozeCategories)
    }
    categories.forEach(bulldozeCategories)
    return allCategories
}

export const getContentTypeSchema = (codec: GenericCodec): ContentTypeSchema => {
    let schema = new ContentTypeSchema()
    schema.schemaId = codec.schema.uri
    schema.validationLevel = ValidationLevel.CONTENT_TYPE
    schema.body = JSON.stringify({
        id: codec.schema.uri,
        title: `${_.last(codec.schema.uri.split('/'))} integration`,
        description: `${_.last(codec.schema.uri.split('/'))} integration`,
        allOf: [{ "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content" }],
        type: "object",
        properties: codec.schema.properties,
        propertyOrder: Object.keys(codec.schema.properties)
    })
    return schema
}

export const getContentType = (codec: GenericCodec): ContentType => {
    let contentType = new ContentType()
    contentType.contentTypeUri = codec.schema.uri
    contentType.settings = {
        label: `${_.last(codec.schema.uri.split('/'))} integration`,
        icons: [{
            size: 256,
            url: codec.schema.icon
        }]
    }
    return contentType
}