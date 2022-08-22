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
const common_1 = require("../../../common");
const __1 = require("../..");
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../../../common/util");
const slugify_1 = __importDefault(require("slugify"));
const btoa_1 = __importDefault(require("btoa"));
class SFCCCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'sfcc';
    }
    get properties() {
        return Object.assign(Object.assign({}, common_1.ClientCredentialProperties), { api_token: {
                title: "Shopper API Token",
                type: "string",
                maxLength: 100
            }, site_id: {
                title: "Site ID",
                type: "string"
            } });
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new SFCCCommerceCodec(config).init(this);
        });
    }
    // novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
    postProcess(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // apply any postprocessing required
            return Object.assign({ api_token: (0, btoa_1.default)(`${config.client_id}:${config.client_secret}`) }, config);
        });
    }
}
exports.SFCCCommerceCodecType = SFCCCommerceCodecType;
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
const mapProduct = (product) => {
    var _a;
    if (!product) {
        return null;
    }
    const largeImages = product.image_groups.find(group => group.view_type === 'large');
    const images = largeImages.images.map(image => ({ url: image.link }));
    return {
        id: product.id,
        name: product.name,
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        shortDescription: product.short_description,
        longDescription: product.long_description,
        categories: [],
        variants: ((_a = product.variants) === null || _a === void 0 ? void 0 : _a.map(variant => ({
            sku: variant.product_id,
            listPrice: (0, util_1.formatMoneyString)(variant.price, { currency: product.currency }),
            salePrice: (0, util_1.formatMoneyString)(variant.price, { currency: product.currency }),
            images,
            attributes: variant.variation_values
        }))) || [{
                sku: product.id,
                listPrice: (0, util_1.formatMoneyString)(product.price, { currency: product.currency }),
                salePrice: (0, util_1.formatMoneyString)(product.price, { currency: product.currency }),
                images,
                attributes: {}
            }]
    };
};
class SFCCCommerceCodec extends __1.CommerceCodec {
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.shopApi = `/s/${this.config.site_id}/dw/shop/v22_4`;
            this.sitesApi = `/s/-/dw/data/v22_4/sites/${this.config.site_id}`;
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
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = (yield this.fetch(`${this.shopApi}/categories/root?levels=4`)).categories;
            this.megaMenu = categories.filter(cat => cat.parent_category_id === 'root').map(mapCategory);
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield axios_1.default.get(url, {
                baseURL: this.config.api_url,
                params: {
                    client_id: this.config.client_id
                }
            })).data;
        });
    }
    authenticatedFetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.rest.get({ url })).data;
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(`${this.shopApi}/products/${productId}?expand=prices,options,images,variations`);
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let searchResults = (yield this.fetch(`${this.shopApi}/product_search?${query}`)).hits;
            if (searchResults) {
                return yield Promise.all(searchResults.map((searchResult) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.getProductById.bind(this)(searchResult.product_id);
                })));
            }
            return [];
        });
    }
    getProducts(args) {
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
            return products.map(mapProduct);
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authenticatedFetch(`${this.sitesApi}/customer_groups`);
        });
    }
}
exports.SFCCCommerceCodec = SFCCCommerceCodec;
exports.default = SFCCCommerceCodecType;
// registerCodec(new SFCCCommerceCodecType())
