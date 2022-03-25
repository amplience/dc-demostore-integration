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
exports.AmplienceClient = void 0;
const lodash_1 = __importDefault(require("lodash"));
class AmplienceClient {
    constructor(key) {
        this.hub = key.split(':')[0];
        this.environment = key.split(':')[1];
    }
    toString() {
        return [this.hub, this.environment].join(':');
    }
    getContentItem(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`;
            let response = yield fetch(`https://${this.hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`);
            return (yield response.json()).content;
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = yield this.getContentItem({ key: `aria/env/${this.environment}` });
            if (!obj) {
                throw `[ aria ] Couldn't find config with key '${this.toString()}'`;
            }
            obj.commerce = obj.commerce && (yield this.getContentItem({ id: obj.commerce.id }));
            obj.cms.hubs = lodash_1.default.keyBy(obj.cms.hubs, 'key');
            obj.algolia.credentials = lodash_1.default.keyBy(obj.algolia.credentials, 'key');
            obj.algolia.indexes = lodash_1.default.keyBy(obj.algolia.indexes, 'key');
            obj.locator = this.toString();
            return obj;
        });
    }
}
exports.AmplienceClient = AmplienceClient;
