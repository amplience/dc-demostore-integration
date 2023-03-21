"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsArgError = exports.mapIdentifiers = exports.getContentTypeSchema = exports.getContentType = exports.CTypes = exports.logResponse = exports.flattenCategories = exports.findInCategoryTree = void 0;
const constants_1 = require("../../common/constants");
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
const process_1 = require("process");
const codec_error_1 = require("./codec-error");
/**
 * Find a category in the category tree by slug.
 * @param categories Root categories in category tree
 * @param slug Category slug
 * @returns Found category, if present
 */
const findInCategoryTree = (categories, slug) => {
    return (0, exports.flattenCategories)(categories).find(category => { var _a; return ((_a = category.slug) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (slug === null || slug === void 0 ? void 0 : slug.toLowerCase()); });
};
exports.findInCategoryTree = findInCategoryTree;
/**
 * Flattens categories to a single dimensional array, rather than a tree
 * @param categories Root categories
 * @returns Flattened list of categories
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
 * Helper method for logging requests/responses when the LOG_INTEGRATION environment variable is set.
 * @param response Response
 */
const logResponse = (method, request, response) => {
    if (process_1.env.LOG_INTEGRATION) {
        console.log('============== REQUEST ==============');
        console.log(`${method.toUpperCase()} ${request}`);
        console.log('============== RESPONSE ==============');
        console.log(JSON.stringify(response, null, 4));
    }
    return response;
};
exports.logResponse = logResponse;
/**
 * Demostore Content Types for Amplience
 */
exports.CTypes = {
    demostoreconfig: {
        label: 'demostore config',
        schemaUri: constants_1.CONSTANTS.demostoreConfigUri,
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
        schemaUri: `${constants_1.CONSTANTS.demostoreIntegrationUri}/rest`,
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
 * Get an Amplience Content Type representing the given CType.
 * @param ctype Content Type Template
 * @returns Amplience Content Type
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
 * Get an Amplience Content Type Schema representing the given CType.
 * @param ctype Content Type Template
 * @returns Amplience Content Type Schema
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
/**
 * Ensures a given array of identifiable objects has matching position to a list of IDs.
 * Missing items are replaced with null.
 * @param ids List of IDs
 * @param items List of items
 * @returns Items in the order of the specified ID list
 */
const mapIdentifiers = (ids, items) => {
    return ids.map(id => { var _a; return (_a = items.find(item => item && item.id == id)) !== null && _a !== void 0 ? _a : null; });
};
exports.mapIdentifiers = mapIdentifiers;
/**
 * Construct a CodecError for when get products arguments are missing
 * @param method Method name
 * @returns Codec error
 */
const getProductsArgError = (method) => {
    return new codec_error_1.CodecError(codec_error_1.CodecErrorType.IncorrectArguments, { message: `${method} requires either: productIds, keyword, or category reference.` });
};
exports.getProductsArgError = getProductsArgError;
