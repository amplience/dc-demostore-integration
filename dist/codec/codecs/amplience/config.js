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
exports.AmplienceConfigCodec = exports.AmplienceCodecConfiguration = void 0;
const lodash_1 = __importDefault(require("lodash"));
const codec_1 = require("../../codec");
const codec_manager_1 = require("../../codec-manager");
class AmplienceCodecConfiguration extends codec_1.CodecConfiguration {
}
exports.AmplienceCodecConfiguration = AmplienceCodecConfiguration;
class AmplienceConfigCodec extends codec_1.ConfigCodec {
    getContentItem(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`;
            let url = `https://${this.config.hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`;
            let response = yield fetch(url);
            return (yield response.json()).content;
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = yield this.getContentItem({ key: `aria/env/${this.config.environment}` });
            if (!obj) {
                let x = `${this.config.hub}:${this.config.environment}`;
                throw `[ aria ] Couldn't find config with key '${x}'`;
            }
            obj.commerce = obj.commerce && (yield this.getContentItem({ id: obj.commerce.id }));
            obj.cms.hubs = lodash_1.default.keyBy(obj.cms.hubs, 'key');
            obj.algolia.credentials = lodash_1.default.keyBy(obj.algolia.credentials, 'key');
            obj.algolia.indexes = lodash_1.default.keyBy(obj.algolia.indexes, 'key');
            // console.log(obj)
            return obj;
        });
    }
}
exports.AmplienceConfigCodec = AmplienceConfigCodec;
const type = {
    vendor: 'amplience',
    codecType: 'config',
    validate: (config) => {
        return config && config.hub && config.environment;
    },
    create: (config) => {
        return new AmplienceConfigCodec(config);
    }
};
exports.default = type;
// register myself with codecManager
codec_manager_1.codecManager.registerCodecType(type);
