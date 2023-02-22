"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.massMock = exports.mockAxios = void 0;
const actualAxios = jest.requireActual('axios');
const methods = ['get', 'put', 'post', 'delete', 'patch'];
function getMockAxios(method, methodRequests, requests, baseConfig) {
    return (url, config) => {
        var _a;
        config = Object.assign(Object.assign(Object.assign({}, baseConfig), config), { url: url });
        const urlObj = new URL(url, config.baseURL);
        const keys = Array.from(urlObj.searchParams.keys());
        for (const key of keys) {
            urlObj.searchParams.delete(key);
        }
        const urlWithParams = new URL(url, config.baseURL).toString();
        const fullUrl = urlObj.toString();
        requests.push({
            url: urlWithParams,
            config
        });
        let request = methodRequests[urlWithParams];
        if (request == null) {
            request = methodRequests[fullUrl];
        }
        if (request == null) {
            return Promise.reject({
                status: 404,
                statusText: 'Not Found',
                data: {},
                headers: {},
                config
            });
        }
        let contentType;
        let requestData = request.data;
        if (typeof requestData === 'function') {
            requestData = requestData(method, config, urlObj.searchParams);
        }
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
function mockAxios(axios, mockFixture, requests, baseConfig = {}) {
    var _a;
    for (const method of methods) {
        const methodRequests = (_a = mockFixture[method]) !== null && _a !== void 0 ? _a : [];
        const mock = axios[method];
        mock.mockImplementation(getMockAxios(method, methodRequests, requests, baseConfig));
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
