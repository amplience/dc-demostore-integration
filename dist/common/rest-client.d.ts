import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface OAuthRestClientInterface {
    authenticate: (payload: any, config: AxiosRequestConfig) => Promise<void>;
    get: (config: AxiosRequestConfig) => Promise<any>;
}
export declare const OAuthRestClient: ({ api_url, auth_url }: {
    api_url: any;
    auth_url: any;
}, payload: any, config?: AxiosRequestConfig) => {
    authenticate: () => Promise<AxiosInstance>;
    get: (config: AxiosRequestConfig) => Promise<any>;
};
export default OAuthRestClient;
