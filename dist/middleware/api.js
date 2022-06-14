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
exports.getCommerceAPI = exports.baseConfigLocator = void 0;
const amplience_1 = require("../amplience");
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const index_2 = require("../index");
exports.baseConfigLocator = process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || process.env.STORYBOOK_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default`;
const getAPI = (config) => __awaiter(void 0, void 0, void 0, function* () {
    let configLocator;
    if (!config || !config.hasOwnProperty('config_locator')) {
        configLocator = exports.baseConfigLocator;
    }
    else if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator;
    }
    return configLocator ?
        yield (0, index_1.getCodec)((yield (0, amplience_1.getDemoStoreConfig)(configLocator)).commerce) :
        yield (0, index_1.getCodec)(config);
});
// getCommerceAPI is the main client interaction point with the integration layer
const getCommerceAPI = (params = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, index_2.isServer)()) {
        return yield getAPI(params);
    }
    else {
        const getResponse = (operation) => (args) => __awaiter(void 0, void 0, void 0, function* () {
            const apiUrl = window.isStorybook ? `https://core.dc-demostore.com/api` : `/api`;
            return yield (yield axios_1.default.get(apiUrl, { params: Object.assign(Object.assign(Object.assign({}, args), params), { operation }) })).data;
        });
        return {
            getProduct: getResponse('getProduct'),
            getProducts: getResponse('getProducts'),
            getCategory: getResponse('getCategory'),
            getMegaMenu: getResponse('getMegaMenu'),
            getCustomerGroups: getResponse('getCustomerGroups')
        };
    }
});
exports.getCommerceAPI = getCommerceAPI;
// handler for /api route
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    let commerceAPI = yield (0, exports.getCommerceAPI)(req.body || req.query);
    switch (req.method.toLowerCase()) {
        case 'get':
            return res.status(200).json(yield commerceAPI[req.query.operation](req.query));
        case 'post':
            return res.status(200).json(yield commerceAPI[req.body.operation](req.body));
        case 'options':
            return res.status(200).send();
        default:
            break;
    }
});
exports.default = handler;
