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
exports.getCommerceAPI = void 0;
const amplience_1 = require("../amplience");
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const index_2 = require("../index");
const getAPI = (config) => __awaiter(void 0, void 0, void 0, function* () {
    let configLocator;
    if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator;
    }
    return configLocator ?
        yield (0, index_1.getCodec)((yield (0, amplience_1.getDemoStoreConfig)(configLocator)).commerce) :
        yield (0, index_1.getCodec)(config);
});
const getResponse = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const commerceAPI = yield getAPI(query.params);
    if (!commerceAPI) {
        throw new Error(`commerceAPI not found for ${JSON.stringify(query.params)}`);
    }
    if (!commerceAPI[query.operation]) {
        throw new Error(`invalid operation: ${query.operation}`);
    }
    return (0, index_2.isServer)() ? yield commerceAPI[query.operation](query.args) : yield (yield axios_1.default.post(`/api`, query)).data;
});
const getCommerceAPI = (params) => ({
    getProduct: (args) => __awaiter(void 0, void 0, void 0, function* () { return yield getResponse({ params, args, operation: 'getProduct' }); }),
    getProducts: (args) => __awaiter(void 0, void 0, void 0, function* () { return yield getResponse({ params, args, operation: 'getProducts' }); }),
    getCategory: (args) => __awaiter(void 0, void 0, void 0, function* () { return yield getResponse({ params, args, operation: 'getCategory' }); }),
    getMegaMenu: (args) => __awaiter(void 0, void 0, void 0, function* () { return yield getResponse({ params, args, operation: 'getMegaMenu' }); }),
    getCustomerGroups: (args) => __awaiter(void 0, void 0, void 0, function* () { return yield getResponse({ params, args, operation: 'getCustomerGroups' }); })
});
exports.getCommerceAPI = getCommerceAPI;
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).json(yield getResponse(req.body)); });
exports.default = handler;
