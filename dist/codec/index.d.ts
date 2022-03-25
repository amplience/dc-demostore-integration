export interface CodecGenerator {
    SchemaURI: string;
    getInstance: (config: CodecConfiguration) => Promise<Codec>;
}
export interface CodecConfiguration {
    _meta?: {
        deliveryKey?: string;
        deliveryId: string;
        schema: string;
    };
    locator?: string;
}
export declare abstract class Codec {
    config: CodecConfiguration;
    codecId: string;
    constructor(config: CodecConfiguration);
}
export declare const registerCodec: (codec: CodecGenerator) => void;
export declare const getCodec: (config: CodecConfiguration) => Promise<any>;
