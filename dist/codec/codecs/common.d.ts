import { ContentType, ContentTypeSchema } from 'dc-management-sdk-js';
import { Dictionary } from 'lodash';
import { Category } from '../../common/types';
import { CodecError } from './codec-error';
/**
 * Find a category in the mega menu by slug.
 * @param categories Root categories in mega menu
 * @param slug Category slug
 * @returns Found category, if present
 */
export declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
/**
 * Flattens categories to a single dimensional array, rather than a tree
 * @param categories Root categories
 * @returns Flattened list of categories
 */
export declare const flattenCategories: (categories: Category[]) => Category[];
/**
 * Helper method for logging requests/responses when the LOG_INTEGRATION environment variable is set.
 * @param response Response
 */
export declare const logResponse: <T>(method: string, request: string, response: T) => T;
/**
 * Amplience Content Type Schema Template
 */
export interface CTypeSchema {
    definitions?: any;
    properties: any;
}
/**
 * Amplience Content Type Template
 */
export interface CType {
    label: string;
    schemaUri: string;
    iconUrl: string;
    schema: CTypeSchema;
}
/**
 * Demostore Content Types for Amplience
 */
export declare const CTypes: Dictionary<CType>;
/**
 * Get an Amplience Content Type representing the given CType.
 * @param ctype Content Type Template
 * @returns Amplience Content Type
 */
export declare const getContentType: (ctype: CType) => ContentType;
/**
 * Get an Amplience Content Type Schema representing the given CType.
 * @param ctype Content Type Template
 * @returns Amplience Content Type Schema
 */
export declare const getContentTypeSchema: (ctype: CType) => ContentTypeSchema;
/**
 * Ensures a given array of identifiable objects has matching position to a list of IDs.
 * Missing items are replaced with null.
 * @param ids List of IDs
 * @param items List of items
 */
export declare const mapIdentifiers: <T extends {
    id: string;
}>(ids: string[], items: T[]) => T[];
export declare const mapIdentifiersNumber: <T extends {
    id: number;
}>(ids: string[], items: T[]) => T[];
/**
 * Construct a CodecError for when get products arguments are missing
 * @param method Method name
 * @returns Codec error
 */
export declare const getProductsArgError: (method: string) => CodecError;
