import { AxiosRequestConfig } from 'axios';
import { CodecPropertyConfig } from '../codec/codecs/core';
import { HttpMethod } from 'dc-management-sdk-js';
import { StringProperty } from '../codec/cms-property-types';
/**
 * Configuration interface with an API url.
 */
export declare type APIConfiguration = {
    api_url: StringProperty;
};
/**
 * Configuration interface with an API and Auth url.
 */
export declare type OAuthCodecConfiguration = APIConfiguration & {
    auth_url: StringProperty;
};
/**
 * Configuration interface with an API, Auth and credentials.
 */
export declare type ClientCredentialsConfiguration = OAuthCodecConfiguration & {
    client_id: StringProperty;
    client_secret: StringProperty;
};
/**
 * Configuration interface with a username and password.
 */
export declare type UsernamePasswordConfiguration = {
    username: StringProperty;
    password: StringProperty;
};
/**
 * JSON schema properties describing UsernamePasswordConfiguration.
 */
export declare const UsernamePasswordProperties: UsernamePasswordConfiguration;
/**
 * JSON schema properties describing APIConfiguration.
 */
export declare const APIProperties: APIConfiguration;
/**
 * JSON schema properties describing OAuthCodecConfiguration.
 */
export declare const OAuthProperties: OAuthCodecConfiguration;
/**
 * JSON schema properties describing client credential OAuth properties.
 */
export declare const ClientCredentialProperties: ClientCredentialsConfiguration;
/**
 * Interface for a REST client with all HTTP methods.
 */
export declare type OAuthRestClientInterface = {
    [Z in keyof typeof HttpMethod as Lowercase<Z>]: (config: AxiosRequestConfig | string) => Promise<any>;
};
/**
 * A REST client with OAuth authentication and methods for each request type.
 */
export declare const OAuthRestClient: (config: CodecPropertyConfig<OAuthCodecConfiguration>, payload: any, requestConfig?: AxiosRequestConfig, getHeaders?: (auth: any) => any) => OAuthRestClientInterface;
export default OAuthRestClient;
