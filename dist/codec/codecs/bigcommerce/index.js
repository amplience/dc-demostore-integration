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
exports.BigCommerceCommerceCodec = exports.BigCommerceCommerceCodecType = void 0;
const common_1 = require("../../../common");
const __1 = require("../..");
const axios_1 = __importDefault(require("axios"));
const mappers_1 = require("./mappers");
class BigCommerceCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'bigcommerce';
    }
    get properties() {
        return Object.assign(Object.assign({}, common_1.APIProperties), { api_token: {
                title: 'API Token',
                type: 'string',
                minLength: 1
            }, store_hash: {
                title: 'Store hash',
                type: 'string',
                minLength: 1
            } });
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new BigCommerceCommerceCodec(config).init(this);
        });
    }
}
exports.BigCommerceCommerceCodecType = BigCommerceCommerceCodecType;
class BigCommerceCommerceCodec extends __1.CommerceCodec {
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            this.megaMenu = (yield this.fetch('/v3/catalog/categories/tree')).map(mappers_1.mapCategory);
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.request({
                method: 'get',
                url,
                baseURL: `${this.config.api_url}/stores/${this.config.store_hash}`,
                headers: {
                    'X-Auth-Token': this.config.api_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (url.indexOf('customer_groups') > -1) {
                return response.data;
            }
            return response.data.data;
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield this.fetch(`/v3/catalog/products?id:in=${args.productIds}&include=images,variants`);
            }
            else if (args.keyword) {
                products = yield this.fetch(`/v3/catalog/products?keyword=${args.keyword}`);
            }
            else if (args.category) {
                products = yield this.fetch(`/v3/catalog/products?categories:in=${args.category.id}`);
            }
            return products.map(mappers_1.mapProduct);
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.fetch('/v2/customer_groups')).map(mappers_1.mapCustomerGroup);
        });
    }
}
exports.BigCommerceCommerceCodec = BigCommerceCommerceCodec;
exports.default = BigCommerceCommerceCodecType;
// registerCodec(new BigCommerceCommerceCodecType())
