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
exports.middleware = exports.getCommerceAPI = void 0;
const amplience_1 = require("../amplience");
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const util_1 = require("../common/util");
/**
 * Get an API for the given configuration.
 * @param config Configuration object
 * @returns API matching the configuration.
 */
const getAPI = (config) => __awaiter(void 0, void 0, void 0, function* () {
    // we are passed in an object here
    //   - if it does not the key 'config_locator', it is assumed to be the config block for a codec
    //   - else retrieve the object
    //     - if the schema of the object is NOT the demostoreconfig, it is assumed to be the config block
    //     - else retrieve the object with id <demostoreconfig.commerce.id>
    if ('config_locator' in config) {
        const [hub, _] = config.config_locator.split(':');
        config = yield (0, amplience_1.getContentItemFromConfigLocator)(config.config_locator);
        if (config._meta.schema === index_1.CONSTANTS.demostoreConfigUri) {
            config = yield (0, amplience_1.getContentItem)(hub, config.commerce);
        }
    }
    // novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
    const matchingCodec = (0, index_1.getCodecs)().find((c) => { var _a; return c.vendor === config.vendor || c.schemaUri === ((_a = config._meta) === null || _a === void 0 ? void 0 : _a.schema); });
    if (matchingCodec) {
        config = yield matchingCodec.postProcess(config);
    }
    // end novadev-582
    return yield (0, index_1.getCommerceCodec)(config);
});
/**
 * Get a Commerce API for the given configuration.
 * @param params Configuration object and vendor
 * @returns Commerce API matching the configuration.
 */
// getCommerceAPI is the main client interaction point with the integration layer
const getCommerceAPI = (params = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    const codec = (0, util_1.flattenConfig)(params);
    //const codec = params.codec_params ?? params // merge in vendor with params
    if ((0, util_1.isServer)()) {
        return yield getAPI(codec);
    }
    else {
        const getResponse = (operation) => (args) => __awaiter(void 0, void 0, void 0, function* () {
            const apiUrl = window.isStorybook
                ? 'https://core.dc-demostore.com/api'
                : '/api';
            return yield (yield axios_1.default.get(apiUrl, { params: Object.assign(Object.assign(Object.assign({}, args), codec), { operation }) })).data;
        });
        return {
            getProduct: getResponse('getProduct'),
            getProducts: getResponse('getProducts'),
            getCategory: getResponse('getCategory'),
            getMegaMenu: getResponse('getMegaMenu'),
            getCustomerGroups: getResponse('getCustomerGroups'),
            getRawProducts: getResponse('getRawProducts')
        };
    }
});
exports.getCommerceAPI = getCommerceAPI;
/**
 * Integration middleware request handler. Provides access to commerce api methods.
 * @param req Request object
 * @param res Response object
 * @returns Response
 */
// handler for /api route
const middleware = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    const config = req.body || req.query;
    const commerceAPI = yield (0, exports.getCommerceAPI)(config);
    switch (req.method.toLowerCase()) {
        case 'get':
        case 'post':
            return res.status(200).json(yield commerceAPI[config.operation](config));
        case 'options':
            return res.status(200).send();
        default:
            break;
    }
});
exports.middleware = middleware;
exports.default = exports.middleware;
