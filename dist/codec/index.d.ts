export interface CodecConfiguration {
    _meta?: {
        deliveryKey?: string;
        deliveryId: string;
        schema: string;
    };
    locator?: string;
}
export interface Codec {
    SchemaURI: string;
    getAPI(config: CodecConfiguration): any;
    canUseConfiguration(config: CodecConfiguration): boolean;
}
export interface CommerceCodec extends Codec {
    getAPI(config: CodecConfiguration): CommerceAPI;
}
export declare const registerCodec: (codec: Codec) => void;
export declare const getCodec: <T extends API>(config: CodecConfiguration) => T;
import './codecs/bigcommerce';
import './codecs/commercetools';
import './codecs/sfcc';
import './codecs/elasticpath';
import './codecs/rest';
import './codecs/fabric';
import './codecs/hybris';
import { API, CommerceAPI } from '..';
