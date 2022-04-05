import { AxiosRequestConfig } from 'axios';
export interface OAuthRestClientInterface {
    authenticate: (payload: any, config: AxiosRequestConfig) => Promise<void>;
    get: (config: AxiosRequestConfig) => Promise<any>;
}
declare const OAuthRestClient: ({ api_url, auth_url }: {
    api_url: any;
    auth_url: any;
}) => {
    authenticate: (payload: any, config?: AxiosRequestConfig) => Promise<void>;
    get: (config: AxiosRequestConfig) => Promise<any>;
};
export default OAuthRestClient;
