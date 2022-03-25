import { Product, Category, QueryContext } from '../../types';
import { CodecConfiguration, Codec } from '..';
import { CommerceAPI } from '../..';
import Moltin, { Price } from '@moltin/sdk';
export interface ElasticPathCommerceCodecConfig extends CodecConfiguration {
    client_id: string;
    client_secret: string;
    api_url: string;
    auth_url: string;
    pcm_url: string;
    catalog_name: string;
}
export interface AttributedProduct extends Moltin.Product {
    id: string;
    attributes: any;
}
export interface NodeLocator {
    hierarchyId: string;
    nodeId: string;
}
export interface CategoryWithHierarchyId extends Category {
    hierarchyId: string;
}
export interface PriceBookPrice extends Price {
    pricebookName: string;
}
export declare class ElasticPathCommerceCodec extends Codec implements CommerceAPI {
    config: ElasticPathCommerceCodecConfig;
    constructor(config: ElasticPathCommerceCodecConfig);
    start(): Promise<void>;
    getProduct(context: QueryContext): Promise<Product>;
    getProducts(context: QueryContext): Promise<Product[]>;
    getCategory(context: QueryContext): Promise<Category>;
    getMegaMenu(): Promise<Category[]>;
}
declare const _default: {
    SchemaURI: string;
    getInstance: (config: any) => Promise<ElasticPathCommerceCodec>;
};
export default _default;
