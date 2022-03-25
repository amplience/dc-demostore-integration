import { Operation } from './operation';
import { Category, CategoryResults, Product, QueryContext } from '../../../types';
import { Codec, CodecConfiguration } from '../../../codec';
import { CommerceAPI } from '../../../index';
export interface CommerceToolsCodecConfiguration extends CodecConfiguration {
    client_id: string;
    client_secret: string;
    auth_url: string;
    api_url: string;
    project: string;
    scope: string;
}
declare class CommerceToolsCodec extends Codec implements CommerceAPI {
    productOperation: Operation;
    categoryOperation: Operation;
    constructor(config: CodecConfiguration);
    getMegaMenu(): Promise<Category[]>;
    getProduct(query: QueryContext): Promise<Product>;
    getProducts(query: QueryContext): Promise<Product[]>;
    getCategoryHierarchy(query: QueryContext): Promise<Category[]>;
    getCategories(query: QueryContext): Promise<CategoryResults>;
    getCategory(query: QueryContext): Promise<Category>;
    getProductsForCategory(parent: Category, query: QueryContext): Promise<any>;
}
declare const _default: {
    SchemaURI: string;
    getInstance: (config: any) => Promise<CommerceToolsCodec>;
};
export default _default;
