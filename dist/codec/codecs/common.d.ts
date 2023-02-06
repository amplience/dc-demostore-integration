import { ContentType, ContentTypeSchema } from 'dc-management-sdk-js';
import { Dictionary } from 'lodash';
import { Category } from '../../common/types';
/**
 * TODO
 * @param categories
 * @param slug
 * @returns
 */
export declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
/**
 * TODO
 * @param categories
 * @returns
 */
export declare const flattenCategories: (categories: Category[]) => Category[];
/**
 * TODO
 */
export interface CTypeSchema {
    definitions?: any;
    properties: any;
}
/**
 * TODO
 */
export interface CType {
    label: string;
    schemaUri: string;
    iconUrl: string;
    schema: CTypeSchema;
}
/**
 * TODO
 */
export declare const CTypes: Dictionary<CType>;
/**
 * TODO
 * @param ctype
 * @returns
 */
export declare const getContentType: (ctype: CType) => ContentType;
/**
 * TODO
 * @param ctype
 * @returns
 */
export declare const getContentTypeSchema: (ctype: CType) => ContentTypeSchema;
