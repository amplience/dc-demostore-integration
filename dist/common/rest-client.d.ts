import { AxiosRequestConfig } from 'axios';
export interface OAuthRestClientInterface {
    authenticate: () => Promise<void>;
    get: (config: AxiosRequestConfig) => Promise<any>;
}
declare const OAuthRestClient: ({ api_url, auth_url, client_id, client_secret }: {
    api_url: any;
    auth_url: any;
    client_id: any;
    client_secret: any;
}) => {
    authenticate: () => Promise<void>;
    get: (config: AxiosRequestConfig) => Promise<any>;
};
export default OAuthRestClient;
