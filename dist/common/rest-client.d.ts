import { AxiosRequestConfig } from 'axios';
import { CodecStringConfig, StringProperty } from '..';
import { HttpMethod } from 'dc-management-sdk-js';
export declare type OAuthRestClientInterface = {
    [Z in keyof typeof HttpMethod as Lowercase<Z>]: (config: AxiosRequestConfig | string) => Promise<any>;
};
export declare type APIConfiguration = {
    api_url: StringProperty;
};
export declare type OAuthCodecConfiguration = APIConfiguration & {
    auth_url: StringProperty;
};
export declare type ClientCredentialsConfiguration = OAuthCodecConfiguration & {
    client_id: StringProperty;
    client_secret: StringProperty;
};
export declare const APIProperties: APIConfiguration;
export declare const OAuthProperties: OAuthCodecConfiguration;
export declare const ClientCredentialProperties: ClientCredentialsConfiguration;
export declare const OAuthRestClient: (config: CodecStringConfig<OAuthCodecConfiguration>, payload: any, requestConfig?: AxiosRequestConfig, getHeaders?: (auth: any) => any) => {
    get: (config: AxiosRequestConfig | string) => Promise<any>;
    delete: (config: AxiosRequestConfig | string) => Promise<any>;
    put: (config: AxiosRequestConfig | string) => Promise<any>;
    post: (config: AxiosRequestConfig | string) => Promise<any>;
    patch: (config: AxiosRequestConfig | string) => Promise<any>;
};
export default OAuthRestClient;
