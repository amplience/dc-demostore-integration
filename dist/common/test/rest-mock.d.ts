import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
export interface MockRequest {
    status?: number;
    data: string | object;
    headers?: object;
}
export declare type MockRequestOrFunction = MockRequest | ((config: AxiosRequestConfig) => MockRequest);
export interface MockRequests {
    [url: string]: MockRequestOrFunction;
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
interface DataResponseMapping {
    data: any;
    response: MockRequest;
}
export declare function mockAxios(axios: AxiosInstance, mockFixture: MockFixture, requests: Request[], baseConfig?: {}): void;
export declare function massMock(axios: AxiosStatic, requests: Request[], mockFixture: MockFixture): void;
export declare function dataToResponse(mappings: DataResponseMapping[]): (config: AxiosRequestConfig) => MockRequest;
export {};
