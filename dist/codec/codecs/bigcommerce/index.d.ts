import { CodecConfiguration } from '../../../codec';
import { CommerceAPI } from '../../../index';
export interface BigCommerceCodecConfiguration extends CodecConfiguration {
    api_url: string;
    api_token: string;
    store_hash: string;
}
declare const bigCommerceCodec: {
    SchemaURI: string;
    getAPI: (config: BigCommerceCodecConfiguration) => CommerceAPI;
};
export default bigCommerceCodec;
