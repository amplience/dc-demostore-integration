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
    getAPI(config: CodecConfiguration): Promise<API>;
    canUseConfiguration(config: CodecConfiguration): boolean;
}
export declare const registerCodec: (codec: Codec) => void;
export declare const getCodec: (config: CodecConfiguration) => Promise<any>;
import './codecs/bigcommerce';
import './codecs/commercetools';
import './codecs/sfcc';
import './codecs/elasticpath';
import './codecs/rest';
import { API } from '..';
