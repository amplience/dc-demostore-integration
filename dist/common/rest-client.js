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
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const util_1 = require("../util");
const cache = {};
const OAuthRestClient = ({ api_url, auth_url, client_id, client_secret }) => {
    let authenticatedAxios;
    const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`authenticating to ${auth_url}`);
        let response = yield axios_1.default.post(auth_url, qs_1.default.stringify({
            grant_type: 'client_credentials',
            client_id,
            client_secret
        }));
        const auth = response.data;
        console.log(`authenticated to ${auth_url}`);
        authenticatedAxios = axios_1.default.create({
            baseURL: api_url,
            headers: {
                Authorization: `${auth.token_type} ${auth.access_token}`
            }
        });
        setTimeout(() => { authenticate(); }, auth.expires_in * 99);
    });
    const get = (config) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let response = cache[config.url];
            if (!response) {
                // console.log(`[ get ] ${api_url}${config.url}`)
                response = yield authenticatedAxios(config);
                cache[config.url] = response;
                setTimeout(() => {
                    console.log(`[ delete ] ${config.url}`);
                    delete cache[config.url];
                }, 600000);
            }
            else {
                // console.log(`[ get ] ${apiUrl}${config.url} [ cached ]`)
            }
            return response.data;
        }
        catch (error) {
            if (error.response.status === 429) {
                yield (0, util_1.sleep)(1000);
                // console.log(`[ get ] ${apiUrl}${config.url} [ rate limited ]`)
                return yield get(config);
            }
            else if (error.response.status === 404) {
                // don't throw on a 404 just return an empty result set
                return { data: undefined };
            }
            if (error.stack) {
                console.log(error.stack);
            }
            console.log(`Error while getting URL [ ${config.url} ]: ${error.message} ${error.code}`);
        }
    });
    return {
        authenticate,
        get
    };
};
class OAuthRestClientx {
    constructor({ apiUrl, authUrl, clientId, clientSecret }) {
        this.apiUrl = apiUrl;
        this.authUrl = authUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
}
exports.default = OAuthRestClient;
