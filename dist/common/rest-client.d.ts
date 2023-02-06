import { AxiosRequestConfig } from 'axios';
import { CodecPropertyConfig } from '..';
import { HttpMethod } from 'dc-management-sdk-js';
import { StringProperty } from '../codec/cms-property-types';
/**
 * TODO
 */
export declare type APIConfiguration = {
    api_url: StringProperty;
};
/**
 * TODO
 */
export declare type OAuthCodecConfiguration = APIConfiguration & {
    auth_url: StringProperty;
};
/**
 * TODO
 */
export declare type ClientCredentialsConfiguration = OAuthCodecConfiguration & {
    client_id: StringProperty;
    client_secret: StringProperty;
};
/**
 * TODO
 */
export declare type UsernamePasswordConfiguration = {
    username: StringProperty;
    password: StringProperty;
};
export declare const UsernamePasswordProperties: UsernamePasswordConfiguration;
export declare const APIProperties: APIConfiguration;
export declare const OAuthProperties: OAuthCodecConfiguration;
export declare const ClientCredentialProperties: ClientCredentialsConfiguration;
/**
 * TODO
 */
export declare type OAuthRestClientInterface = {
    [Z in keyof typeof HttpMethod as Lowercase<Z>]: (config: AxiosRequestConfig | string) => Promise<any>;
};
/**
 * TODO
 */
export declare const OAuthRestClient: (config: CodecPropertyConfig<OAuthCodecConfiguration>, payload: any, requestConfig?: AxiosRequestConfig, getHeaders?: (auth: any) => any) => OAuthRestClientInterface;
export default OAuthRestClient;
