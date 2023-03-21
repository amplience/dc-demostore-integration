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
const common_1 = require("../../../../common");
const core_1 = require("../../core");
const axios_1 = __importDefault(require("axios"));
const mappers_1 = require("./mappers");
const codec_error_1 = require("../../codec-error");
const common_2 = require("../../common");
/**
 * Commerce Codec Type that integrates with BigCommerce.
 */
class BigCommerceCommerceCodecType extends core_1.CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor() {
        return 'bigcommerce';
    }
    /**
     * @inheritdoc
     */
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
    /**
     * @inheritdoc
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new BigCommerceCommerceCodec(config).init(this);
        });
    }
}
exports.BigCommerceCommerceCodecType = BigCommerceCommerceCodecType;
/**
 * ommerce Codec that integrates with BigCommerce.
 */
class BigCommerceCommerceCodec extends core_1.CommerceCodec {
    /**
     * @inheritdoc
     */
    cacheCategoryTree() {
        return __awaiter(this, void 0, void 0, function* () {
            this.categoryTree = (yield this.fetch('/v3/catalog/categories/tree')).map(mappers_1.mapCategory);
        });
    }
    /**
     * Fetches data using store hash and API token.
     * @param url URL to fetch data from
     * @returns Response data
     */
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: 'get',
                url,
                baseURL: `${this.config.api_url}/stores/${this.config.store_hash}`,
                headers: {
                    'X-Auth-Token': this.config.api_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            const response = yield (0, codec_error_1.catchAxiosErrors)(() => __awaiter(this, void 0, void 0, function* () { return yield axios_1.default.request(request); }));
            if (url.indexOf('customer_groups') > -1) {
                return (0, common_2.logResponse)('get', url, response).data;
            }
            return (0, common_2.logResponse)('get', url, response).data.data;
        });
    }
    /**
     * @inheritdoc
     */
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getRawProducts(args, 'getProducts')).map(mappers_1.mapProduct);
        });
    }
    /**
     * @inheritdoc
     */
    getRawProducts(args, method = 'getRawProducts') {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds && args.productIds === '') {
                products = [];
            }
            else if (args.productIds) {
                const ids = args.productIds.split(',');
                products = (0, common_2.mapIdentifiers)(ids, yield this.fetch(`/v3/catalog/products?id:in=${args.productIds}&include=images,variants`));
            }
            else if (args.keyword) {
                products = yield this.fetch(`/v3/catalog/products?keyword=${args.keyword}&include=images,variants`);
            }
            else if (args.category && args.category.id === '') {
                products = [];
            }
            else if (args.category) {
                products = yield this.fetch(`/v3/catalog/products?categories:in=${args.category.id}&include=images,variants`);
            }
            else {
                throw (0, common_2.getProductsArgError)(method);
            }
            return products;
        });
    }
    /**
     * @inheritdoc
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.fetch('/v2/customer_groups')).map(mappers_1.mapCustomerGroup);
        });
    }
}
exports.BigCommerceCommerceCodec = BigCommerceCommerceCodec;
exports.default = BigCommerceCommerceCodecType;
// registerCodec(new BigCommerceCommerceCodecType())
