import { CodecConfiguration, Codec } from '../..';
export interface RestCommerceCodecConfig extends CodecConfiguration {
    productURL: string;
    categoryURL: string;
    translationsURL: string;
}
declare const restCodec: Codec;
export default restCodec;
