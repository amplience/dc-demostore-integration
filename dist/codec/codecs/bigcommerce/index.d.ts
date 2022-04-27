import { CommerceCodec, CodecConfiguration } from '../../../codec';
export interface BigCommerceCodecConfiguration extends CodecConfiguration {
    api_url: string;
    api_token: string;
    store_hash: string;
}
declare const bigCommerceCodec: CommerceCodec;
export default bigCommerceCodec;
