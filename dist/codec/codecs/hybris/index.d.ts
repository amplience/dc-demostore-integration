import { CodecConfiguration, Codec } from '../..';
export interface HybrisCommerceCodecConfig extends CodecConfiguration {
    api_url: string;
    catalog_id: string;
}
declare const hybrisCodec: Codec;
export default hybrisCodec;
