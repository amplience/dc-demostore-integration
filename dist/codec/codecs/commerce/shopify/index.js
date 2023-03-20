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
const pagination_1 = require("../../pagination");
const PAGE_SIZE = 100;
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
     * Converts GraphQL errors to CodecError info.
     * @param errors GraphQL errors
     * @returns CodecError info
     */
    fromGqlErrors(errors) {
        const message = errors.map(error => error.message).join(', ');
        return {
            message,
            errors
        };
    }
    /**
     * Make a request to the shopify GraphQL API.
     * @param query The GraphQL query string
     * @param variables Variables to use with the GraphQL query
     * @param isAdmin Whether the admin credentials must be used or not
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
            if (result.data == null && result.errors) {
                throw new codec_error_1.CodecError(codec_error_1.CodecErrorType.ApiGraphQL, this.fromGqlErrors(result.errors));
            }
            return result.data;
        });
    }
    /**
     * Generate a function that gets a page from the shopify GraphQL API.
     * @param query The GraphQL query string
     * @param variables Variables to use with the GraphQL query
     * @param getPaginated Function that gets the Paginated<T2> type from the request type T
     * @param isAdmin Whether the admin credentials must be used or not
     * @returns A function that gets a page from a cursor and pageSize.
     */
    getPageGql(query, variables, getPaginated, isAdmin = false) {
        return (cursor, pageSize) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.gqlRequest(query, Object.assign(Object.assign({}, variables), { pageSize, after: cursor }), isAdmin);
            const paginated = getPaginated(result);
            if (paginated.edges.length > pageSize) {
                paginated.edges = paginated.edges.slice(0, pageSize);
                return {
                    data: paginated.edges.map(edge => edge.node),
                    nextCursor: paginated.edges.at(-1).cursor,
                    hasNext: true
                };
            }
            return {
                data: paginated.edges.map(edge => edge.node),
                nextCursor: paginated.pageInfo.endCursor,
                hasNext: paginated.pageInfo.hasNextPage
            };
        });
    }
    /**
     * @inheritdoc
     */
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const shopifyCollections = yield (0, pagination_1.paginateCursor)(this.getPageGql(queries_1.collections, {}, response => response.collections), PAGE_SIZE);
            this.megaMenu = shopifyCollections.data.map(collection => (0, mappers_1.mapCategory)(collection));
        });
    }
    /**
     * Get a shopify product by ID.
     * @param id The ID of the product to fetch
     * @returns The shopify product
     */
    getProductById(id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = (yield this.gqlRequest(queries_1.productById, { id }))) === null || _a === void 0 ? void 0 : _a.product) !== null && _b !== void 0 ? _b : null;
        });
    }
    /**
     * Get a list of all shopify products that match the given keyword.
     * @param keyword Keyword used to search products
     * @returns A list of all matching products
     */
    getProductsByKeyword(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = keyword;
            const shopifyProducts = yield (0, pagination_1.paginateCursor)(this.getPageGql(queries_1.productsByQuery, { query }, response => response.products), PAGE_SIZE);
            return shopifyProducts.data;
        });
    }
    /**
     * Get a list of all shopify products in the category with the given slug.
     * @param slug The category slug
     * @returns A list of all products in the category
     */
    getProductsByCategory(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const handle = slug;
            const shopifyProducts = yield (0, pagination_1.paginateCursor)(this.getPageGql(queries_1.productsByCategory, { handle }, response => response.collection.products), PAGE_SIZE);
            return shopifyProducts.data;
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
            const shopifySegments = yield (0, pagination_1.paginateCursor)(this.getPageGql(queries_1.segments, {}, response => response.segments, true), PAGE_SIZE);
            return shopifySegments.data.map(segment => (0, mappers_1.mapCustomerGroup)(segment));
        });
    }
}
exports.ShopifyCommerceCodec = ShopifyCommerceCodec;
exports.default = ShopifyCommerceCodecType;
// registerCodec(new ShopifyCommerceCodecType())
