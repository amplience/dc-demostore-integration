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
exports.getConfig = exports.getDemoStoreConfig = exports.getContentItemFromConfigLocator = exports.getContentItem = void 0;
const lodash_1 = __importDefault(require("lodash"));
const crypt_keeper_1 = require("../common/crypt-keeper");
const errors_1 = require("../common/errors");
/**
 * Get a content item from a Dynamic Content hub.
 * @param hub Dynamic Content hub
 * @param args ID or key of the content item
 * @returns
 */
const getContentItem = (hub, args) => __awaiter(void 0, void 0, void 0, function* () {
    const path = args.id && `id/${args.id}` || args.key && `key/${args.key}`;
    const response = yield fetch(`https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`);
    return response.status === 200 ? (0, crypt_keeper_1.CryptKeeper)((yield response.json()).content, hub).decryptAll() : null;
});
exports.getContentItem = getContentItem;
/**
 * Gets the demostore config content item given a configLocator string.
 * @param configLocator Locator to use as part of the delivery key
 * @returns Demostore config content item
 */
const getContentItemFromConfigLocator = (configLocator) => __awaiter(void 0, void 0, void 0, function* () {
    const [hub, lookup] = configLocator.split(':');
    const contentItem = yield (0, exports.getContentItem)(hub, { key: `demostore/${lookup}` });
    if (!contentItem) {
        // todo: add help url
        throw new errors_1.IntegrationError({
            message: `no content item found for config_locator ${configLocator}`,
            helpUrl: ''
        });
    }
    return contentItem;
});
exports.getContentItemFromConfigLocator = getContentItemFromConfigLocator;
/**
 * Gets the demostore config given a key string.
 * @param key Locator to use as part of the delivery key
 * @returns Demostore config object
 */
const getDemoStoreConfig = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = yield (0, exports.getContentItemFromConfigLocator)(key);
    return Object.assign(Object.assign({}, obj), { algolia: {
            credentials: lodash_1.default.keyBy(obj.algolia.credentials, 'key'),
            indexes: lodash_1.default.keyBy(obj.algolia.indexes, 'key')
        } });
});
exports.getDemoStoreConfig = getDemoStoreConfig;
// getConfig still used in place of getDemoStoreConfig as of v1.1.3
exports.getConfig = exports.getDemoStoreConfig;
