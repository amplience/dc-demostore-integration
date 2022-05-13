import { Category } from '../../../types';
import { Codec } from '../..';
import Moltin, { PriceBook, PriceBookPriceBase } from '@moltin/sdk';
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
