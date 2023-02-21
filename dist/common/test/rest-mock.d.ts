import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
export interface MockRequest {
    status?: number;
    data: string | object | ((method: string, config: AxiosRequestConfig, params: URLSearchParams) => object);
    headers?: object;
}
export interface MockRequests {
    [url: string]: MockRequest;
}
export interface MockFixture {
    get?: MockRequests;
    post?: MockRequests;
    put?: MockRequests;
    patch?: MockRequests;
    delete?: MockRequests;
}
export interface Request {
    url: string;
    config: AxiosRequestConfig;
}
export declare function mockAxios(axios: AxiosInstance, mockFixture: MockFixture, requests: Request[], baseConfig?: {}): void;
export declare function massMock(axios: AxiosStatic, requests: Request[], mockFixture: MockFixture): void;
