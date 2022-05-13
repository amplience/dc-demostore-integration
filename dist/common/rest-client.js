"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthRestClient = exports.ClientCredentialProperties = exports.OAuthProperties = exports.APIProperties = void 0;
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../util");
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
exports.APIProperties = {
    api_url: {
        title: "Base API URL",
        type: "string",
        minLength: 0,
        maxLength: 100
    }
};
exports.OAuthProperties = Object.assign(Object.assign({}, exports.APIProperties), { auth_url: {
        title: "Oauth URL",
        type: "string",
        minLength: 0,
        maxLength: 100
    } });
exports.ClientCredentialProperties = {
    client_id: {
        title: "Client ID",
        type: "string",
        minLength: 0,
        maxLength: 50
    },
    client_secret: {
        title: "Client secret",
        type: "string",
        minLength: 0,
        maxLength: 100
    }
};
const OAuthRestClient = (config, payload, requestConfig = {}, getHeaders) => {
    let authenticatedAxios;
    let status = 'NOT_LOGGED_IN';
    const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!authenticatedAxios) {
            let response = yield axios_1.default.post(config.auth_url, payload, requestConfig);
            const auth = response.data;
            if (!getHeaders) {
                getHeaders = (auth) => ({
                    Authorization: `${auth.token_type || 'Bearer'} ${auth.access_token}`
                });
            }
            authenticatedAxios = axios_1.default.create({
                baseURL: config.api_url,
                headers: getHeaders(auth)
            });
            setTimeout(() => { authenticate(); }, auth.expires_in * 999);
        }
        return authenticatedAxios;
    });
    const request = (method) => (config) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (typeof config === 'string') {
            config = { url: config };
        }
        // authentication
        switch (status) {
            case 'LOGGING_IN':
                yield (0, util_1.sleep)(100);
                return yield request(method)(config);
            case 'NOT_LOGGED_IN':
                status = 'LOGGING_IN';
                break;
            case 'LOGGED_IN':
                break;
        }
        authenticatedAxios = yield authenticate();
        if (status === 'LOGGING_IN') {
            status = 'LOGGED_IN';
        }
        try {
            // console.log(`[ rest ] get ${config.url}`)
            return yield (yield authenticatedAxios.request(Object.assign({ method }, config))).data;
        }
        catch (error) {
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                yield (0, util_1.sleep)(1000);
                return yield request(method)(config);
            }
            else if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                // don't throw on a 404 just return an empty result set
                return null;
            }
            if (error.stack) {
                console.log(error.stack);
            }
            console.log(`Error while ${method}ing URL [ ${config.url} ]: ${error.message} ${error.code}`);
        }
    });
    return {
        get: request(dc_management_sdk_js_1.HttpMethod.GET),
        delete: request(dc_management_sdk_js_1.HttpMethod.DELETE),
        post: request(dc_management_sdk_js_1.HttpMethod.POST),
        patch: request(dc_management_sdk_js_1.HttpMethod.PATCH)
    };
};
exports.OAuthRestClient = OAuthRestClient;
exports.default = exports.OAuthRestClient;
