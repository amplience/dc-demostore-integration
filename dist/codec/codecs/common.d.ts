import { ContentType, ContentTypeSchema } from 'dc-management-sdk-js';
import { Dictionary } from 'lodash';
import { Category } from '../../common/types';
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
