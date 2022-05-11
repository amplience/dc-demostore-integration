import { ContentType, ContentTypeSchema } from "dc-management-sdk-js";
import { Codec } from "..";
import { Category } from "../../types";
declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
declare const flattenCategories: (categories: Category[]) => Category[];
declare const getContentTypeSchema: (codec: Codec) => ContentTypeSchema;
declare const getContentType: (codec: Codec) => ContentType;
export { findInMegaMenu, flattenCategories, getContentType, getContentTypeSchema };
