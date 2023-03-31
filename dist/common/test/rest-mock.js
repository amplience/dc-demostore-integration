"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataToResponse = exports.massMock = exports.mockAxios = void 0;
const lodash_1 = require("lodash");
const actualAxios = jest.requireActual('axios');
// http methods
const methods = ['get', 'put', 'post', 'delete', 'patch'];
// http data methods
const dataMethods = ['put', 'post', 'patch'];
/**
 * Combine a base url with a relative url
 * @param baseUrl Base URL
 * @param relativeUrl Relative URL
 * @returns Combined URL
 */
function combineUrls(baseUrl, relativeUrl) {
    if (!baseUrl)
        return relativeUrl;
    return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl;
}
/**
 * Get a mock axios method with the given set of mocked requests, requests out array, and base config.
 * @param method HTTP method
 * @param methodRequests Mocked requests for this method
 * @param requests Array to place requests from calls into
 * @param baseConfig Base axios configuration
 * @returns Mocked axios method
 */
function getMockAxios(method, methodRequests, requests, baseConfig) {
    return (url, config) => {
        var _a;
        config = Object.assign(Object.assign(Object.assign({}, baseConfig), config), { url: url });
        const urlWithParams = combineUrls(config.baseURL, url);
        const urlObj = new URL(urlWithParams);
        const keys = Array.from(urlObj.searchParams.keys());
        for (const key of keys) {
            urlObj.searchParams.delete(key);
        }
        const fullUrl = urlObj.toString();
        requests.push({
            url: urlWithParams,
            config
        });
        let requestF = methodRequests[urlWithParams];
        if (requestF == null) {
            requestF = methodRequests[fullUrl];
        }
        if (requestF == null) {
            return Promise.reject({
                config,
                response: {
                    status: 404,
                    statusText: 'Not Found',
                    data: {},
                    headers: {},
                    config
                }
            });
        }
        const request = (typeof requestF == 'function') ? requestF(config) : requestF;
        let contentType;
        const requestData = request.data;
        if (typeof requestData === 'object') {
            contentType = 'application/json';
        }
        return Promise.resolve({
            status: (_a = request.status) !== null && _a !== void 0 ? _a : 200,
            statusText: 'OK',
            data: request.data,
            headers: Object.assign({ 'content-type': contentType }, request.headers),
            config
        });
    };
}
/**
 * Mock the methods of an axios instance
 * @param axios Axios instance
 * @param mockFixture Fixture containing mocked requests and responses
 * @param requests Array to place requests from calls into
 * @param baseConfig Base axios configuration
 */
function mockAxios(axios, mockFixture, requests, baseConfig = {}) {
    var _a;
    for (const method of methods) {
        const methodRequests = (_a = mockFixture[method]) !== null && _a !== void 0 ? _a : [];
        const mock = axios[method];
        if (dataMethods.indexOf(method) !== -1) {
            mock.mockImplementation((url, data, config) => {
                if (config == null) {
                    config = {};
                }
                config.data = data;
                return getMockAxios(method, methodRequests, requests, baseConfig)(url, config);
            });
        }
        else {
            mock.mockImplementation(getMockAxios(method, methodRequests, requests, baseConfig));
        }
    }
    const reqMock = axios.request;
    reqMock.mockImplementation((config) => {
        var _a;
        const method = config.method.toLowerCase();
        const methodRequests = (_a = mockFixture[method]) !== null && _a !== void 0 ? _a : [];
        return getMockAxios(method, methodRequests, requests, baseConfig)(config.url, config);
    });
}
exports.mockAxios = mockAxios;
/**
 * Mock the methods of the static axios class.
 * @param axios Static axios object
 * @param requests Array to place requests from calls into
 * @param mockFixture Fixture containing mocked requests and responses
 */
function massMock(axios, requests, mockFixture) {
    mockAxios(axios, mockFixture, requests);
    const mockCreate = axios.create;
    mockCreate.mockImplementation((config) => {
        const client = actualAxios.create(config);
        for (const method of methods) {
            client[method] = jest.fn();
        }
        client.request = jest.fn();
        mockAxios(client, mockFixture, requests, config);
        return client;
    });
}
exports.massMock = massMock;
/**
 * Helper method that returns a function mapping from axios request data to a specific response.
 * Useful for having POST data specific responses for requests to the same endpoint.
 * @param mappings Data to response mapping
 * @returns A method that finds a matching response given the input axios request config.
 */
function dataToResponse(mappings) {
    return (config) => {
        const matching = mappings.find(mapping => (0, lodash_1.isEqual)(mapping.data, config.data));
        if (!matching) {
            throw new Error('Unrecognized request data.');
        }
        return matching.response;
    };
}
exports.dataToResponse = dataToResponse;
