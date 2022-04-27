export declare type CodecConfiguration = {
    _meta?: {
        deliveryKey?: string;
        deliveryId: string;
        schema: string;
    };
    locator?: string;
};
export interface Codec {
    SchemaURI: string;
    getAPI(config: CodecConfiguration): any;
}
export interface CommerceCodec extends Codec {
    getAPI(config: CodecConfiguration): CommerceAPI;
}
export declare const getCodecs: () => Codec[];
export declare const registerCodec: (codec: Codec) => void;
export declare const getCodec: (config: CodecConfiguration) => API;
import './codecs/bigcommerce';
import './codecs/commercetools';
import './codecs/sfcc';
import './codecs/elasticpath';
import './codecs/rest';
import './codecs/fabric';
import './codecs/hybris';
import { API, CommerceAPI } from '..';
