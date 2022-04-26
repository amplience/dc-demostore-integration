import { CommerceCodec } from '../../../codec';
import { OAuthCodecConfiguration } from '../../../common/rest-client';
export interface SFCCCodecConfiguration extends OAuthCodecConfiguration {
    api_token: string;
    site_id: string;
    client_id: string;
    client_secret: string;
}
declare const sfccCodec: CommerceCodec;
export default sfccCodec;
