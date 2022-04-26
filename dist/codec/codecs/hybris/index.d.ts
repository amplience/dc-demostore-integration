import { CodecConfiguration, CommerceCodec } from '../..';
export interface HybrisCommerceCodecConfig extends CodecConfiguration {
    api_url: string;
    catalog_id: string;
}
declare const hybrisCodec: CommerceCodec;
export default hybrisCodec;
