import { ContentType, ContentTypeSchema } from "dc-management-sdk-js";
import { GenericCodec } from "..";
import { Category } from "../../common/types";
export declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
export declare const flattenCategories: (categories: Category[]) => Category[];
export declare const getContentTypeSchema: (codec: GenericCodec) => ContentTypeSchema;
export declare const getContentType: (codec: GenericCodec) => ContentType;
