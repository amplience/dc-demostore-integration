import { Codec } from '../..';
import { OAuthCodecConfiguration } from '../../../common/rest-client';
export interface FabricCommerceCodecConfig extends OAuthCodecConfiguration {
    username: string;
    password: string;
    accountId: string;
}
declare const fabricCodec: Codec;
export default fabricCodec;
