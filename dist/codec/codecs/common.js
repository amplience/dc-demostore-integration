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
        var _a;
        allCategories.push(cat);
        (_a = cat === null || cat === void 0 ? void 0 : cat.children) === null || _a === void 0 ? void 0 : _a.forEach(bulldozeCategories);
    };
    categories.forEach(bulldozeCategories);
    return allCategories;
};
exports.flattenCategories = flattenCategories;
const getContentTypeSchema = (codec) => {
    let schema = new dc_management_sdk_js_1.ContentTypeSchema();
    let schemaUri = `${index_1.CONSTANTS.demostoreIntegrationUri}/${codec.vendor}`;
    schema.schemaId = schemaUri;
    schema.validationLevel = dc_management_sdk_js_1.ValidationLevel.CONTENT_TYPE;
    schema.body = JSON.stringify({
        id: schemaUri,
        title: `${codec.vendor} integration`,
        description: `${codec.vendor} integration`,
        allOf: [{ "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content" }],
        type: "object",
        properties: Object.assign(Object.assign({}, codec.properties), { vendor: {
                type: 'string',
                title: 'vendor',
                const: codec.vendor
            } }),
        propertyOrder: Object.keys(codec.properties)
    });
    return schema;
};
exports.getContentTypeSchema = getContentTypeSchema;
const getContentType = (codec) => {
    let contentType = new dc_management_sdk_js_1.ContentType();
    let schemaUri = `${index_1.CONSTANTS.demostoreIntegrationUri}/${codec.vendor}`;
    contentType.contentTypeUri = schemaUri;
    contentType.settings = {
        label: `${codec.vendor} integration`,
        icons: [{
                size: 256,
                url: `https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/${codec.vendor}.png`
            }]
    };
    return contentType;
};
exports.getContentType = getContentType;
