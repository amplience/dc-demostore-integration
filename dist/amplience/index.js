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
exports.getDemoStoreConfig = exports.getContentItemFromConfigLocator = exports.getContentItem = void 0;
const lodash_1 = __importDefault(require("lodash"));
const crypt_keeper_1 = require("../common/crypt-keeper");
const getContentItem = (hub, args) => __awaiter(void 0, void 0, void 0, function* () {
    let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`;
    // console.log(`[ amp ] https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
    let response = yield fetch(`https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`);
    return response.status === 200 ? (0, crypt_keeper_1.CryptKeeper)((yield response.json()).content, hub).decryptAll() : null;
});
exports.getContentItem = getContentItem;
const getContentItemFromConfigLocator = (configLocator) => __awaiter(void 0, void 0, void 0, function* () {
    let [hub, lookup] = configLocator.split(':');
    if ((lookup === null || lookup === void 0 ? void 0 : lookup.indexOf('/')) === -1) {
        lookup = `config/${lookup}`;
    }
    return yield (0, exports.getContentItem)(hub, { key: `demostore/${lookup}` });
});
exports.getContentItemFromConfigLocator = getContentItemFromConfigLocator;
const getDemoStoreConfig = (key) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = yield (0, exports.getContentItemFromConfigLocator)(key);
    if (!obj) {
        throw `[ demostore ] Couldn't find config with key '${key}'`;
    }
    // obj.commerce = obj.commerce && await getContentItem(hub, { id: obj.commerce.id })
    obj.algolia.credentials = lodash_1.default.keyBy(obj.algolia.credentials, 'key');
    obj.algolia.indexes = lodash_1.default.keyBy(obj.algolia.indexes, 'key');
    return obj;
});
exports.getDemoStoreConfig = getDemoStoreConfig;
