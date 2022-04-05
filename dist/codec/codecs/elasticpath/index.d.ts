import { Category } from '../../../types';
import { CodecConfiguration, Codec } from '../..';
import Moltin, { PriceBook, PriceBookPriceBase } from '@moltin/sdk';
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
export interface ElasticPathCategory extends Category {
    hierarchyId: string;
}
export interface PriceBookPrice extends PriceBookPriceBase {
    pricebook: PriceBook;
}
declare const epCodec: Codec;
export default epCodec;
