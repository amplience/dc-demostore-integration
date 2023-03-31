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
 * Mock the methods of an axios instance
 * @param axios Axios instance
 * @param mockFixture Fixture containing mocked requests and responses
 * @param requests Array to place requests from calls into
 * @param baseConfig Base axios configuration
 */
export declare function mockAxios(axios: AxiosInstance, mockFixture: MockFixture, requests: Request[], baseConfig?: {}): void;
/**
 * Mock the methods of the static axios class.
 * @param axios Static axios object
 * @param requests Array to place requests from calls into
 * @param mockFixture Fixture containing mocked requests and responses
 */
export declare function massMock(axios: AxiosStatic, requests: Request[], mockFixture: MockFixture): void;
/**
 * Helper method that returns a function mapping from axios request data to a specific response.
 * Useful for having POST data specific responses for requests to the same endpoint.
 * @param mappings Data to response mapping
 * @returns A method that finds a matching response given the input axios request config.
 */
export declare function dataToResponse(mappings: DataResponseMapping[]): (config: AxiosRequestConfig) => MockRequest;
export {};
