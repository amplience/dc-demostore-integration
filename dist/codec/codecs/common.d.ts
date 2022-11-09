import { ContentType, ContentTypeSchema } from 'dc-management-sdk-js';
import { Dictionary } from 'lodash';
import { Category } from '../../common/types';
export declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
export declare const flattenCategories: (categories: Category[]) => Category[];
export interface CTypeSchema {
    definitions?: any;
    properties: any;
}
export interface CType {
    label: string;
    schemaUri: string;
    iconUrl: string;
    schema: CTypeSchema;
}
export declare const CTypes: Dictionary<CType>;
export declare const getContentType: (ctype: CType) => ContentType;
export declare const getContentTypeSchema: (ctype: CType) => ContentTypeSchema;
