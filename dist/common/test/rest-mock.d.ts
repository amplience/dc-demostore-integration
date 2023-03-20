import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
/**
 * Mock request object type
 */
export interface MockRequest {
    status?: number;
    data: string | object;
    headers?: object;
}
/**
 * Mock request or function returning a mock request
 */
export declare type MockRequestOrFunction = MockRequest | ((config: AxiosRequestConfig) => MockRequest);
/**
 * Object matching urls with mock requests or functions
 */
export interface MockRequests {
    [url: string]: MockRequestOrFunction;
}
/**
 * Mock fixture object matching request methods with mock requests
 */
export interface MockFixture {
    get?: MockRequests;
    post?: MockRequests;
    put?: MockRequests;
    patch?: MockRequests;
    delete?: MockRequests;
}
/**
 * Axios request type
 */
export interface Request {
    url: string;
    config: AxiosRequestConfig;
}
/**
 * Object mapping data with a mock request
 */
interface DataResponseMapping {
    data: any;
    response: MockRequest;
}
/**
 * TODO
 * @param axios
 * @param mockFixture
 * @param requests
 * @param baseConfig
 */
export declare function mockAxios(axios: AxiosInstance, mockFixture: MockFixture, requests: Request[], baseConfig?: {}): void;
/**
 * TODO
 * @param axios
 * @param requests
 * @param mockFixture
 */
export declare function massMock(axios: AxiosStatic, requests: Request[], mockFixture: MockFixture): void;
/**
 * TODO
 * @param mappings
 * @returns
 */
export declare function dataToResponse(mappings: DataResponseMapping[]): (config: AxiosRequestConfig) => MockRequest;
export {};
