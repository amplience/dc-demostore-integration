import { AxiosRequestConfig } from 'axios';
import { StringProperty } from '..';
export interface OAuthRestClientInterface {
    get: (config: AxiosRequestConfig | string) => Promise<any>;
    patch: (config: AxiosRequestConfig | string) => Promise<any>;
    delete: (config: AxiosRequestConfig | string) => Promise<any>;
    post: (config: AxiosRequestConfig | string) => Promise<any>;
}
export declare type APIConfiguration = {
    api_url: StringProperty;
};
export declare type OAuthCodecConfiguration = APIConfiguration & {
    auth_url: StringProperty;
};
export declare type OAuthCodecStringConfiguration = {
    [Key in keyof OAuthCodecConfiguration]: string;
};
export declare type ClientCredentialsConfiguration = {
    client_id: StringProperty;
    client_secret: StringProperty;
};
export declare const APIProperties: APIConfiguration;
export declare const OAuthProperties: OAuthCodecConfiguration;
export declare const ClientCredentialProperties: ClientCredentialsConfiguration;
export declare const OAuthRestClient: (config: OAuthCodecStringConfiguration, payload: any, requestConfig?: AxiosRequestConfig, getHeaders?: (auth: any) => any) => {
    get: (config: AxiosRequestConfig | string) => Promise<any>;
    delete: (config: AxiosRequestConfig | string) => Promise<any>;
    post: (config: AxiosRequestConfig | string) => Promise<any>;
    patch: (config: AxiosRequestConfig | string) => Promise<any>;
};
export default OAuthRestClient;
