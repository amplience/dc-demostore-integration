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
exports.SFCCCommerceCodec = exports.SFCCCommerceCodecType = void 0;
const common_1 = require("../../../../common");
const core_1 = require("../../core");
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../../../../common/util");
const slugify_1 = __importDefault(require("slugify"));
const btoa_1 = __importDefault(require("btoa"));
const pagination_1 = require("../../pagination");
const common_2 = require("../../common");
const codec_error_1 = require("../../codec-error");
/**
 * Commerce Codec Type that integrates with SFCC.
 */
class SFCCCommerceCodecType extends core_1.CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor() {
        return 'sfcc';
    }
    /**
     * @inheritdoc
     */
    get properties() {
        return Object.assign(Object.assign({}, common_1.ClientCredentialProperties), { api_token: {
                title: 'Shopper API Token',
                type: 'string',
                maxLength: 100
            }, site_id: {
                title: 'Site ID',
                type: 'string'
            } });
    }
    /**
     * @inheritdoc
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new SFCCCommerceCodec(config).init(this);
        });
    }
    /**
     * @inheritdoc
     */
    // novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
    postProcess(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // apply any postprocessing required
            return Object.assign({ api_token: (0, btoa_1.default)(`${config.client_id}:${config.client_secret}`) }, config);
        });
    }
}
exports.SFCCCommerceCodecType = SFCCCommerceCodecType;
/**
 * Map an SFCC category to the common category type.
 * @param category SFCC category
 * @returns Category
 */
const mapCategory = (category) => {
    var _a;
    return {
        id: category.id,
        slug: category.id,
        name: category.name,
        children: ((_a = category.categories) === null || _a === void 0 ? void 0 : _a.map(mapCategory)) || [],
        products: []
    };
};
/**
 * Map an SFCC customer group to the common customer group type.
 * @param group SFCC customer group
 * @returns Customer group
 */
const mapCustomerGroup = (group) => group && Object.assign(Object.assign({}, group), { name: group.id });
/**
 * Map an SFCC product to the common product type.
 * @param product SFCC product
 * @returns Product
 */
// TODO: [NOVADEV-968] able to choose image size?
const mapProduct = (product) => {
    var _a;
    if (!product) {
        return null;
    }
    const largeImages = product.image_groups.find((group) => group.view_type === 'large');
    const images = largeImages.images.map((image) => ({ url: image.dis_base_link }));
    return {
        id: product.id,
        name: product.name,
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        shortDescription: product.short_description,
        longDescription: product.long_description,
        categories: [],
        variants: ((_a = product.variants) === null || _a === void 0 ? void 0 : _a.map((variant) => ({
            sku: variant.product_id,
            listPrice: (0, util_1.formatMoneyString)(variant.price, {
                currency: product.currency
            }),
            salePrice: (0, util_1.formatMoneyString)(variant.price, {
                currency: product.currency
            }),
            images,
            attributes: variant.variation_values
        }))) || [
            {
                sku: product.id,
                listPrice: (0, util_1.formatMoneyString)(product.price, {
                    currency: product.currency
                }),
                salePrice: (0, util_1.formatMoneyString)(product.price, {
                    currency: product.currency
                }),
                images,
                attributes: {}
            }
        ]
    };
};
/**
 * Commerce Codec that integrates with SFCC.
 */
class SFCCCommerceCodec extends core_1.CommerceCodec {
    constructor() {
        super(...arguments);
        this.getPage = (0, pagination_1.getPageByQuery)('start', 'count', 'total', 'data');
        this.getPageAxios = (0, pagination_1.getPageByQueryAxios)('start', 'count', 'total', 'hits');
    }
    /**
     * @inheritdoc
     */
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const version = (_a = this.config.version) !== null && _a !== void 0 ? _a : 'v22_4';
            this.shopApi = `/s/${this.config.site_id}/dw/shop/${version}`;
            this.sitesApi = `/s/-/dw/data/${version}/sites/${this.config.site_id}`;
            this.rest = (0, common_1.OAuthRestClient)(Object.assign(Object.assign({}, this.config), { auth_url: `${this.config.auth_url.replace('oauth/access', 'oauth2/access')}?grant_type=client_credentials` }), {}, {
                headers: {
                    Authorization: 'Basic ' + this.config.api_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    client_id: this.config.client_id
                }
            });
            return yield _super.init.call(this, codecType);
        });
    }
    /**
     * @inheritdoc
     */
    cacheCategoryTree() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = (yield this.fetch(`${this.shopApi}/categories/root?levels=4`)).categories;
            this.categoryTree = categories
                .filter((cat) => cat.parent_category_id === 'root')
                .map(mapCategory);
        });
    }
    /**
     * Gets the request config based off of the configuration parameters
     * @returns Axios request config
     */
    axiosConfig() {
        return {
            baseURL: this.config.api_url,
            params: {
                client_id: this.config.client_id,
            },
        };
    }
    /**
     * Fetches data from the unauthenticated axios client.
     * @param url URL to fetch data from
     * @returns Response data
     */
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, common_2.logResponse)('get', url, (yield (0, codec_error_1.catchAxiosErrors)(() => __awaiter(this, void 0, void 0, function* () {
                return yield axios_1.default.get(url, {
                    baseURL: this.config.api_url,
                    params: {
                        client_id: this.config.client_id
                    }
                });
            }))).data);
        });
    }
    /**
     * Fetches data from the OAuth authenticated client.
     * @param url URL to fetch data from
     * @returns Response data
     */
    authenticatedFetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.rest.get({ url })).data;
        });
    }
    /**
     * Gets an SFCC product by ID.
     * @param productId Product ID to fetch
     * @returns SFCC product
     */
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.fetch(`${this.shopApi}/products/${productId}?expand=prices,options,images,variations&all_images=true`);
            }
            catch (e) {
                if (e.type === codec_error_1.CodecErrorType.NotFound) {
                    return null;
                }
                throw e;
            }
        });
    }
    /**
     * Lists SFCC products for a given search query.
     * @param query Search query
     * @returns List of SFCC products
     */
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchResults = yield (0, pagination_1.paginate)(this.getPageAxios(axios_1.default, `${this.shopApi}/product_search?${query}`, this.axiosConfig(), {}), 200);
            if (searchResults) {
                return yield Promise.all(searchResults.map((searchResult) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.getProductById.bind(this)(searchResult.product_id);
                })));
            }
            return [];
        });
    }
    /**
     * @inheritdoc
     */
    getRawProducts(args, method = 'getRawProducts') {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)));
            }
            else if (args.keyword) {
                products = yield this.search(`q=${args.keyword}`);
            }
            else if (args.category) {
                products = yield this.search(`refine_1=cgid=${args.category.id}`);
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
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getRawProducts(args, 'getProducts')).map(mapProduct);
        });
    }
    /**
     * @inheritdoc
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (0, pagination_1.paginate)(this.getPage(this.rest, `${this.sitesApi}/customer_groups`), 1000)).map(mapCustomerGroup);
        });
    }
}
exports.SFCCCommerceCodec = SFCCCommerceCodec;
exports.default = SFCCCommerceCodecType;
// registerCodec(new SFCCCommerceCodecType())
