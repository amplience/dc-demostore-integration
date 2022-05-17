import { ContentType, ContentTypeSchema } from "dc-management-sdk-js";
import { GenericCodec } from "..";
import { Category } from "../../types";
declare const findInMegaMenu: (categories: Category[], slug: string) => Category;
declare const flattenCategories: (categories: Category[]) => Category[];
declare const getContentTypeSchema: (codec: GenericCodec) => ContentTypeSchema;
declare const getContentType: (codec: GenericCodec) => ContentType;
export { findInMegaMenu, flattenCategories, getContentType, getContentTypeSchema };
