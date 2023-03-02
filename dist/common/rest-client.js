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
exports.OAuthRestClient = exports.ClientCredentialProperties = exports.OAuthProperties = exports.APIProperties = exports.UsernamePasswordProperties = void 0;
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../common/util");
const common_1 = require("../codec/codecs/common");
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
const cms_property_types_1 = require("../codec/cms-property-types");
const codec_error_1 = require("../codec/codecs/codec-error");
/**
 * JSON schema properties describing UsernamePasswordConfiguration.
 */
exports.UsernamePasswordProperties = {
    username: {
        title: 'Username',
        type: 'string',
        minLength: 1
    },
    password: {
        title: 'Password',
        type: 'string',
        minLength: 1
    }
};
/**
 * JSON schema properties describing APIConfiguration.
 */
exports.APIProperties = {
    api_url: {
        title: 'Base API URL',
        type: 'string',
        pattern: cms_property_types_1.StringPatterns.httpUrl
    }
};
/**
 * JSON schema properties describing OAuthCodecConfiguration.
 */
exports.OAuthProperties = Object.assign(Object.assign({}, exports.APIProperties), { auth_url: {
        title: 'Oauth URL',
        type: 'string',
        pattern: cms_property_types_1.StringPatterns.httpUrl
    } });
/**
 * JSON schema properties describing APIConfiguration.
 */
exports.ClientCredentialProperties = Object.assign(Object.assign({}, exports.OAuthProperties), { client_id: {
        title: 'Client ID',
        type: 'string',
        minLength: 1
    }, client_secret: {
        title: 'Client secret',
        type: 'string',
        minLength: 1
    } });
/**
 * A REST client with OAuth authentication and methods for each request type.
 */
const OAuthRestClient = (config, payload, requestConfig = {}, getHeaders) => {
    let authenticatedAxios;
    let status = 'NOT_LOGGED_IN';
    let expiryTime = 0;
    /**
     * Get an authenticated axios client.
     * If not created yet, create and authenticate an axios instance using OAuth.
     * Automatically re-authenticates this client when the token is about to expire.
     * @returns An authenticated axios client.
     */
    const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!authenticatedAxios || Date.now() > expiryTime) {
            const auth = yield (0, codec_error_1.catchAxiosErrors)(() => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield axios_1.default.post(config.auth_url, payload, requestConfig);
                return (0, common_1.logResponse)('post', config.auth_url, response.data);
            }), codec_error_1.CodecErrorType.AuthError);
            if (!getHeaders) {
                getHeaders = (auth) => ({
                    Authorization: `${auth.token_type || 'Bearer'} ${auth.access_token}`
                });
            }
            authenticatedAxios = axios_1.default.create({
                baseURL: config.api_url,
                headers: getHeaders(auth)
            });
            expiryTime = Date.now() + auth.expires_in * 999;
        }
        return authenticatedAxios;
    });
    /**
     * Create an HTTP request function using the given HTTP method.
     * @param method HTTP method
     * @returns HTTP request function, takes axios config or an URL.
     */
    const request = (method) => (config) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
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
            return (0, common_1.logResponse)(method, config.url, yield (yield authenticatedAxios.request(Object.assign({ method }, config))).data);
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
            // if (error.stack) {
            //     console.log(error.stack)
            // }
            throw new codec_error_1.CodecError(codec_error_1.CodecErrorType.ApiError, {
                status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status,
                message: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data
            });
        }
    });
    return {
        get: request(dc_management_sdk_js_1.HttpMethod.GET),
        delete: request(dc_management_sdk_js_1.HttpMethod.DELETE),
        put: request(dc_management_sdk_js_1.HttpMethod.PUT),
        post: request(dc_management_sdk_js_1.HttpMethod.POST),
        patch: request(dc_management_sdk_js_1.HttpMethod.PATCH)
    };
};
exports.OAuthRestClient = OAuthRestClient;
exports.default = exports.OAuthRestClient;
