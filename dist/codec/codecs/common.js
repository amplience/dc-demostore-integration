"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentTypeSchema = exports.getContentType = exports.CTypes = exports.flattenCategories = exports.findInMegaMenu = void 0;
const __1 = require("../..");
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
/**
 * TODO
 * @param categories
 * @param slug
 * @returns
 */
const findInMegaMenu = (categories, slug) => {
    return (0, exports.flattenCategories)(categories).find(category => { var _a; return ((_a = category.slug) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (slug === null || slug === void 0 ? void 0 : slug.toLowerCase()); });
};
exports.findInMegaMenu = findInMegaMenu;
/**
 * TODO
 * @param categories
 * @returns
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
/**
 * TODO
 */
exports.CTypes = {
    demostoreconfig: {
        label: 'demostore config',
        schemaUri: __1.CONSTANTS.demostoreConfigUri,
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
        schemaUri: `${__1.CONSTANTS.demostoreIntegrationUri}/rest`,
        iconUrl: '',
        schema: { properties: {} }
    },
    automation: {
        label: 'demostore automation',
        schemaUri: 'https://demostore.amplience.com/site/automation',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3662/3662817.png',
        schema: { properties: {} }
    }
};
/**
 * TODO
 * @param ctype
 * @returns
 */
const getContentType = (ctype) => {
    const contentType = new dc_management_sdk_js_1.ContentType();
    contentType.contentTypeUri = ctype.schemaUri;
    contentType.settings = {
        label: ctype.label,
        icons: [{
                size: 256,
                url: ctype.iconUrl
            }]
    };
    return contentType;
};
exports.getContentType = getContentType;
/**
 * TODO
 * @param ctype
 * @returns
 */
const getContentTypeSchema = (ctype) => {
    const schema = new dc_management_sdk_js_1.ContentTypeSchema();
    schema.schemaId = schema.id = ctype.schemaUri;
    schema.validationLevel = dc_management_sdk_js_1.ValidationLevel.CONTENT_TYPE;
    schema.body = JSON.stringify({
        id: ctype.schemaUri,
        title: ctype.label,
        description: ctype.label,
        allOf: [{ '$ref': 'http://bigcontent.io/cms/schema/v1/core#/definitions/content' }],
        type: 'object',
        properties: ctype.schema.properties,
        propertyOrder: Object.keys(ctype.schema.properties)
    });
    return schema;
};
exports.getContentTypeSchema = getContentTypeSchema;
