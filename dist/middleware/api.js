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
    if (!config) {
        configLocator = exports.baseConfigLocator;
    }
    else if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator;
    }
    return configLocator ?
        yield (0, index_1.getCommerceCodec)((yield (0, amplience_1.getDemoStoreConfig)(configLocator)).commerce) :
        yield (0, index_1.getCommerceCodec)(config);
});
const getResponse = (operation) => (params) => (args) => __awaiter(void 0, void 0, void 0, function* () {
    const commerceAPI = yield getAPI(params);
    if (!commerceAPI) {
        throw new Error(`commerceAPI not found for ${JSON.stringify(params)}`);
    }
    const method = commerceAPI[operation];
    if (!method) {
        throw new Error(`invalid operation: ${operation}`);
    }
    const apiUrl = typeof window !== 'undefined' && window.isStorybook ? `https://core.dc-demostore.com/api` : `/api`;
    return (0, index_2.isServer)() ? yield method(args) : yield (yield axios_1.default.post(apiUrl, Object.assign(Object.assign({}, args), params))).data;
});
const getCommerceAPI = (params) => ({
    getProduct: getResponse('getProduct')(params),
    getProducts: getResponse('getProducts')(params),
    getCategory: getResponse('getCategory')(params),
    getMegaMenu: getResponse('getMegaMenu')(params),
    getCustomerGroups: getResponse('getCustomerGroups')(params)
});
exports.getCommerceAPI = getCommerceAPI;
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    switch (req.method.toLowerCase()) {
        case 'post':
            return res.status(200).json(yield getResponse(req.body));
        case 'options':
            return res.status(200).send();
        default:
            break;
    }
});
exports.default = handler;
