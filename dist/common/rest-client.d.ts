import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CodecConfiguration } from '..';
export interface OAuthRestClientInterface {
    authenticate: (payload: any, config: AxiosRequestConfig) => Promise<void>;
    get: (config: AxiosRequestConfig) => Promise<any>;
}
export interface OAuthCodecConfiguration extends CodecConfiguration {
    auth_url: string;
    api_url: string;
}
export declare const OAuthRestClient: (config: OAuthCodecConfiguration, payload: any, requestConfig?: AxiosRequestConfig, getHeaders?: (auth: any) => any) => {
    authenticate: () => Promise<AxiosInstance>;
    get: (config: AxiosRequestConfig) => Promise<any>;
};
export default OAuthRestClient;
