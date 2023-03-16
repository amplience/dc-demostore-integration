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
exports.ShopifyCommerceCodec = exports.ShopifyCommerceCodecType = void 0;
const core_1 = require("../../core");
const common_1 = require("../../common");
const axios_1 = __importDefault(require("axios"));
const codec_error_1 = require("../../codec-error");
const queries_1 = require("./queries");
const mappers_1 = require("./mappers");
/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
class ShopifyCommerceCodecType extends core_1.CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor() {
        return 'shopify';
    }
    /**
     * @inheritdoc
     */
    get properties() {
        return {
            access_token: {
                title: 'access token',
                type: 'string',
                minLength: 1
            },
            admin_access_token: {
                title: 'admin access token',
                type: 'string',
                minLength: 1
            },
            version: {
                title: 'version',
                type: 'string',
                minLength: 1
            },
            site_id: {
                title: 'site id',
                type: 'string',
                minLength: 1
            }
        };
    }
    /**
     * @inheritdoc
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new ShopifyCommerceCodec(config).init(this);
        });
    }
}
exports.ShopifyCommerceCodecType = ShopifyCommerceCodecType;
/**
 * A template commerce codec, useful as a starting point for a new integration.
 */
class ShopifyCommerceCodec extends core_1.CommerceCodec {
    // instance variables
    // products: Product[]
    // categories: Category[]
    /**
     * @inheritdoc
     */
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.apiClient = axios_1.default.create({
                baseURL: `https://${this.config.site_id}.myshopify.com/api/${this.config.version}`,
                headers: {
                    'X-Shopify-Storefront-Access-Token': this.config.access_token
                }
            });
            this.adminApiClient = axios_1.default.create({
                baseURL: `https://${this.config.site_id}.myshopify.com/admin/api/${this.config.version}`,
                headers: {
                    'X-Shopify-Access-Token': this.config.admin_access_token
                }
            });
            // this.products = await fetchFromURL(this.config.productURL, [])
            // this.megaMenu = this.categories.filter(cat => !cat.parent)
            return yield _super.init.call(this, codecType);
        });
    }
    /**
     * TODO
     * @param query
     * @param variables
     * @returns
     */
    gqlRequest(query, variables, isAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'graphql.json';
            const result = yield (0, common_1.logResponse)('post', url, (yield (0, codec_error_1.catchAxiosErrors)(() => __awaiter(this, void 0, void 0, function* () {
                if (isAdmin) {
                    return yield this.adminApiClient.post(url, {
                        query,
                        variables
                    });
                }
                else {
                    return yield this.apiClient.post(url, {
                        query,
                        variables
                    });
                }
            }))).data);
            return result.data;
        });
    }
    /**
     * @inheritdoc
     */
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: pagination
            const pageSize = 100;
            const result = yield this.gqlRequest(queries_1.collections, { pageSize });
            this.megaMenu = result.collections.edges.map(edge => (0, mappers_1.mapCategory)(edge.node));
        });
    }
    /**
     * TODO
     * @param id
     * @returns
     */
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.gqlRequest(queries_1.productById, { id })).product;
        });
    }
    /**
     * TODO
     * @param keyword
     * @returns
     */
    getProductsByKeyword(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: pagination
            const query = keyword;
            const pageSize = 100;
            const result = yield this.gqlRequest(queries_1.productsByQuery, { query, pageSize });
            return result.products.edges.map(edge => edge.node);
        });
    }
    /**
     * TODO
     * @param slug
     * @returns
     */
    getProductsByCategory(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: pagination
            const handle = slug;
            const pageSize = 100;
            const result = yield this.gqlRequest(queries_1.productsByCategory, { handle, pageSize });
            return result.collection.products.edges.map(edge => edge.node);
        });
    }
    /**
     * @inheritdoc
     */
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getRawProducts(args)).map(mappers_1.mapProduct);
        });
    }
    /**
     * @inheritdoc
     */
    getRawProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            // eslint-disable-next-line no-empty
            if (args.productIds) {
                products = yield Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)));
            }
            // eslint-disable-next-line no-empty
            else if (args.keyword) {
                products = yield this.getProductsByKeyword(args.keyword);
            }
            // eslint-disable-next-line no-empty
            else if (args.category) {
                products = yield this.getProductsByCategory(args.category.slug);
            }
            else {
                throw (0, common_1.getProductsArgError)('getRawProducts');
            }
            return products;
        });
    }
    /**
     * @inheritdoc
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = 100;
            const result = yield this.gqlRequest(queries_1.segments, { pageSize }, true);
            return result.segments.edges.map(edge => (0, mappers_1.mapCustomerGroup)(edge.node));
        });
    }
}
exports.ShopifyCommerceCodec = ShopifyCommerceCodec;
exports.default = ShopifyCommerceCodecType;
// registerCodec(new ShopifyCommerceCodecType())
