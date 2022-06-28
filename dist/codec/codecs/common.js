"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentType = exports.getContentTypeSchema = exports.flattenCategories = exports.findInMegaMenu = void 0;
const index_1 = require("../../index");
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
/**
 * @deprecated The method should not be used
 */
const findInMegaMenu = (categories, slug) => {
    return (0, exports.flattenCategories)(categories).find(category => { var _a; return ((_a = category.slug) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (slug === null || slug === void 0 ? void 0 : slug.toLowerCase()); });
};
exports.findInMegaMenu = findInMegaMenu;
/**
 * @deprecated The method should not be used
 */
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
    let schemaUri = `${index_1.CONSTANTS.demostoreIntegrationUri}/${codec.metadata.vendor}`;
    schema.schemaId = schemaUri;
    schema.validationLevel = dc_management_sdk_js_1.ValidationLevel.CONTENT_TYPE;
    schema.body = JSON.stringify({
        id: schemaUri,
        title: `${codec.metadata.vendor} integration`,
        description: `${codec.metadata.vendor} integration`,
        allOf: [{ "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content" }],
        type: "object",
        properties: Object.assign(Object.assign({}, codec.metadata.properties), { vendor: {
                type: 'string',
                title: 'vendor',
                const: codec.metadata.vendor
            } }),
        propertyOrder: Object.keys(codec.metadata.properties)
    });
    return schema;
};
exports.getContentTypeSchema = getContentTypeSchema;
const getContentType = (codec) => {
    let contentType = new dc_management_sdk_js_1.ContentType();
    let schemaUri = `${index_1.CONSTANTS.demostoreIntegrationUri}/${codec.metadata.vendor}`;
    contentType.contentTypeUri = schemaUri;
    contentType.settings = {
        label: `${codec.metadata.vendor} integration`,
        icons: [{
                size: 256,
                url: `https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/${codec.metadata.vendor}.png`
            }]
    };
    return contentType;
};
exports.getContentType = getContentType;
