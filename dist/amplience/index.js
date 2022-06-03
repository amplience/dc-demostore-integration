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
exports.getDemoStoreConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("..");
const getContentItem = (hub, args) => __awaiter(void 0, void 0, void 0, function* () {
    let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`;
    let response = yield fetch(`https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`);
    return response.status === 200 ? (0, __1.CryptKeeper)((yield response.json()).content, hub).decryptAll() : null;
});
const getDemoStoreConfig = (key) => __awaiter(void 0, void 0, void 0, function* () {
    let [hub, lookup] = key.split(':');
    // look up aria/env as a fallback to demostore/config for backward compatibility
    let obj = (yield getContentItem(hub, { key: `demostore/config/${lookup}` })) ||
        (yield getContentItem(hub, { key: `aria/env/${lookup}` }));
    if (!obj) {
        throw `[ demostore ] Couldn't find config with key '${key}'`;
    }
    obj.commerce = obj.commerce && (yield getContentItem(hub, { id: obj.commerce.id }));
    obj.algolia.credentials = lodash_1.default.keyBy(obj.algolia.credentials, 'key');
    obj.algolia.indexes = lodash_1.default.keyBy(obj.algolia.indexes, 'key');
    obj.locator = key;
    return obj;
});
exports.getDemoStoreConfig = getDemoStoreConfig;
