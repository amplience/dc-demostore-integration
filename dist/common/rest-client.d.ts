import { AxiosRequestConfig } from 'axios';
import { CodecConfiguration } from '..';
export interface OAuthRestClientInterface {
    get: (config: AxiosRequestConfig | string) => Promise<any>;
    patch: (config: AxiosRequestConfig | string) => Promise<any>;
    delete: (config: AxiosRequestConfig | string) => Promise<any>;
    post: (config: AxiosRequestConfig | string) => Promise<any>;
}
export interface OAuthCodecConfiguration extends CodecConfiguration {
    auth_url: string;
    api_url: string;
}
export declare const OAuthRestClient: (config: OAuthCodecConfiguration, payload: any, requestConfig?: AxiosRequestConfig, getHeaders?: (auth: any) => any) => {
    get: (config: AxiosRequestConfig | string) => Promise<any>;
    delete: (config: AxiosRequestConfig | string) => Promise<any>;
    post: (config: AxiosRequestConfig | string) => Promise<any>;
    patch: (config: AxiosRequestConfig | string) => Promise<any>;
};
export default OAuthRestClient;
