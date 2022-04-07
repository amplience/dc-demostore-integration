import { Codec, CodecConfiguration } from '../../../codec';
export interface SFCCCodecConfiguration extends CodecConfiguration {
    api_url: string;
    auth_url: string;
    api_token: string;
    site_id: string;
    client_id: string;
    client_secret: string;
}
declare const sfccCodec: Codec;
export default sfccCodec;
