import { ContentType, ContentTypeSchema } from "dc-management-sdk-js";
import { Category } from "../../common/types";
import { CodecType } from "../../index";
/**
 * @deprecated The method should not be used
 */
export declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
/**
 * @deprecated The method should not be used
 */
export declare const flattenCategories: (categories: Category[]) => Category[];
export declare const getContentTypeSchema: (codec: CodecType) => ContentTypeSchema;
export declare const getContentType: (codec: CodecType) => ContentType;
