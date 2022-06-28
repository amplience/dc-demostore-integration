import { ContentType, ContentTypeSchema } from "dc-management-sdk-js";
import { GenericCodec } from "..";
import { Category } from "../../common/types";
/**
 * @deprecated The method should not be used
 */
export declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
/**
 * @deprecated The method should not be used
 */
export declare const flattenCategories: (categories: Category[]) => Category[];
export declare const getContentTypeSchema: (codec: GenericCodec) => ContentTypeSchema;
export declare const getContentType: (codec: GenericCodec) => ContentType;
