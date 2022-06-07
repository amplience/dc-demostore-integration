"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentTypeSchema = exports.getContentType = exports.flattenCategories = exports.findInMegaMenu = void 0;
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
const lodash_1 = __importDefault(require("lodash"));
const findInMegaMenu = (categories, slug) => {
    let allCategories = flattenCategories(categories);
    return allCategories.find(category => category.slug.toLowerCase() === slug.toLowerCase());
};
exports.findInMegaMenu = findInMegaMenu;
const flattenCategories = (categories) => {
    const allCategories = [];
    const bulldozeCategories = cat => {
        allCategories.push(cat);
        cat.children && cat.children.forEach(bulldozeCategories);
    };
    categories.forEach(bulldozeCategories);
    return allCategories;
};
exports.flattenCategories = flattenCategories;
const getContentTypeSchema = (codec) => {
    let schema = new dc_management_sdk_js_1.ContentTypeSchema();
    schema.schemaId = codec.schema.uri;
    schema.body = JSON.stringify({
        id: codec.schema.uri,
        title: `${lodash_1.default.last(codec.schema.uri.split('/'))} integration`,
        description: `${lodash_1.default.last(codec.schema.uri.split('/'))} integration`,
        allOf: [{ "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content" }],
        type: "object",
        properties: codec.schema.properties,
        propertyOrder: Object.keys(codec.schema.properties)
    });
    return schema;
};
exports.getContentTypeSchema = getContentTypeSchema;
const getContentType = (codec) => {
    let contentType = new dc_management_sdk_js_1.ContentType();
    contentType.contentTypeUri = codec.schema.uri;
    contentType.settings = {
        label: `${lodash_1.default.last(codec.schema.uri.split('/'))} integration`,
        icons: [{
                size: 256,
                url: codec.schema.icon
            }]
    };
    return contentType;
};
exports.getContentType = getContentType;
