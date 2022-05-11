import { Category } from '../../../types';
import { Codec } from '../..';
import Moltin, { PriceBook, PriceBookPriceBase } from '@moltin/sdk';
import { OAuthCodecConfiguration } from '../../../common/rest-client';
export interface ElasticPathCommerceCodecConfig extends OAuthCodecConfiguration {
    client_id: string;
    client_secret: string;
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
