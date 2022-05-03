import { CommerceAPI } from '../../..';
import { OAuthCodecConfiguration } from '../../../common/rest-client';
export interface FabricCommerceCodecConfig extends OAuthCodecConfiguration {
    username: string;
    password: string;
    accountId: string;
}
declare const fabricCodec: {
    SchemaURI: string;
    getAPI: (config: FabricCommerceCodecConfig) => CommerceAPI;
};
export default fabricCodec;
