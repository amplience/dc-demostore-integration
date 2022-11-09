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
exports.AkeneoCommerceCodec = exports.AkeneoCommerceCodecType = void 0;
const common_1 = require("../../../common");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("../..");
const mappers_1 = require("./mappers");
const util_1 = require("../../../common/util");
const btoa_1 = __importDefault(require("btoa"));
class AkeneoCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'akeneo';
    }
    get properties() {
        return Object.assign(Object.assign({}, common_1.UsernamePasswordProperties), common_1.ClientCredentialProperties);
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new AkeneoCommerceCodec(config).init(this);
        });
    }
}
exports.AkeneoCommerceCodecType = AkeneoCommerceCodecType;
class AkeneoCommerceCodec extends __1.CommerceCodec {
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.rest = (0, common_1.OAuthRestClient)({
                api_url: `${this.config.api_url}/api/rest/v1`,
                auth_url: `${this.config.api_url}/api/oauth/v1/token`
            }, {
                username: this.config.username,
                password: this.config.password,
                grant_type: 'password'
            }, {
                headers: {
                    Authorization: `Basic ${(0, btoa_1.default)(`${this.config.client_id}:${this.config.client_secret}`)}`
                }
            }, (auth) => ({
                Authorization: `Bearer ${auth.access_token}`
            }));
            return yield _super.init.call(this, codecType);
        });
    }
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = yield this.fetch('/categories?limit=100');
            categories = lodash_1.default.concat(categories, yield this.fetch('/categories?limit=100&page=2'));
            categories = lodash_1.default.concat(categories, yield this.fetch('/categories?limit=100&page=3'));
            this.megaMenu = categories.filter(cat => cat.parent === 'master').map((0, mappers_1.mapCategory)(categories));
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.rest.get({ url });
                return result._embedded ? result._embedded.items : result;
            }
            catch (error) {
                console.log(`error url [ ${url} ]`);
            }
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield this.fetch(`/products?search={"identifier":[{"operator":"IN","value":[${(0, util_1.quoteProductIdString)(args.productIds)}]}]}`);
            }
            else if (args.keyword) {
                products = yield this.fetch(`/products?search={"name":[{"operator":"CONTAINS","value":"${args.keyword}","locale":"en_US"}]}`);
            }
            else if (args.category) {
                products = yield this.fetch(`/products?search={"categories":[{"operator":"IN","value":["${args.category.id}"]}]}`);
            }
            return products.map((0, mappers_1.mapProduct)(args));
        });
    }
}
exports.AkeneoCommerceCodec = AkeneoCommerceCodec;
exports.default = AkeneoCommerceCodecType;
// registerCodec(new AkeneoCommerceCodecType())
