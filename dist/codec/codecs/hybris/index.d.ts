import { CodecConfiguration } from '../..';
import { CommerceAPI } from '../../..';
export interface HybrisCommerceCodecConfig extends CodecConfiguration {
    api_url: string;
    catalog_id: string;
}
declare const hybrisCodec: {
    SchemaURI: string;
    getAPI: (config: HybrisCommerceCodecConfig) => CommerceAPI;
};
export default hybrisCodec;
