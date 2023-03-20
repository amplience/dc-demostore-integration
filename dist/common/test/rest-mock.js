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
 * @param baseUrl
 * @param relativeUrl
 * @returns
 */
function combineUrls(baseUrl, relativeUrl) {
    if (!baseUrl)
        return relativeUrl;
    return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl;
}
/**
 * TODO
 * @param method
 * @param methodRequests
 * @param requests
 * @param baseConfig
 * @returns
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
 * TODO
 * @param axios
 * @param mockFixture
 * @param requests
 * @param baseConfig
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
 * TODO
 * @param axios
 * @param requests
 * @param mockFixture
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
 * TODO
 * @param mappings
 * @returns
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
