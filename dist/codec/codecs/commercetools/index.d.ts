import { Codec, CodecConfiguration } from '../../../codec';
export interface CommerceToolsCodecConfiguration extends CodecConfiguration {
    auth_url: string;
    api_url: string;
    client_id: string;
    client_secret: string;
    project: string;
    scope: string;
}
declare const commerceToolsCodec: Codec;
export default commerceToolsCodec;
