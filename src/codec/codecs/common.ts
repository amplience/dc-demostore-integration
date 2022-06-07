import { ContentType, ContentTypeSchema } from "dc-management-sdk-js";
import _ from "lodash";
import { Codec } from "..";
import { Category } from "../../types";

const findInMegaMenu = (categories: Category[], slug: string) => {
    let allCategories = flattenCategories(categories)
    return allCategories.find(category => category.slug.toLowerCase() === slug.toLowerCase())
}

const flattenCategories = (categories: Category[]) => {
    const allCategories: Category[] = []
    const bulldozeCategories = cat => {
        allCategories.push(cat)
        cat.children && cat.children.forEach(bulldozeCategories)
    }
    categories.forEach(bulldozeCategories)
    return allCategories
}

const getContentTypeSchema = (codec: Codec): ContentTypeSchema => {
    let schema = new ContentTypeSchema()
    schema.schemaId = codec.schema.uri
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

const getContentType = (codec: Codec): ContentType => {
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

export { findInMegaMenu, flattenCategories, getContentType, getContentTypeSchema }