import { API, CommerceAPI } from '..';
export declare type CodecConfiguration = {
    _meta?: {
        deliveryKey?: string;
        deliveryId: string;
        schema: string;
    };
    locator?: string;
};
export interface Codec {
    schema: {
        uri: string;
        properties: any;
        icon: string;
    };
    getAPI(config: CodecConfiguration): any;
}
export interface CommerceCodec extends Codec {
    getAPI(config: CodecConfiguration): CommerceAPI;
}
export declare const getCodecs: () => Codec[];
export declare const registerCodec: (codec: Codec) => void;
export declare const getCodec: (config: CodecConfiguration) => API;
