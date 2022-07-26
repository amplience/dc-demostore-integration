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
exports.ConstructorIOCommerceCodec = exports.ConstructorIOCommerceCodecType = void 0;
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("../..");
const util_1 = require("../../../common/util");
const axios_1 = __importDefault(require("axios"));
const slugify_1 = __importDefault(require("slugify"));
const mapCategory = (category) => ({
    id: category.id,
    slug: category.id,
    name: category.name,
    children: category.children.map(mapCategory),
    products: []
});
const mapProduct = (product, megaMenu) => {
    var _a, _b;
    return {
        id: product.id,
        name: product.name,
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        categories: product.group_ids.map(gid => (0, __1.findInMegaMenu)(megaMenu, gid)),
        imageSetId: (_b = (_a = product.variations[0]) === null || _a === void 0 ? void 0 : _a.metadata['attribute-articleNumberMax']) === null || _b === void 0 ? void 0 : _b.padStart(6, '0'),
        variants: product.variations.map(variation => {
            let attributes = {};
            let images = [];
            lodash_1.default.each(variation.metadata, (value, key) => {
                if (key.startsWith('attribute-')) {
                    attributes[key.replace('attribute-', '')] = value;
                }
                else if (key.startsWith('image-')) {
                    images.push({ url: variation.metadata[key] });
                }
            });
            return {
                sku: variation.id,
                listPrice: variation.metadata.listPrice,
                salePrice: variation.metadata.salePrice,
                images,
                attributes
            };
        })
    };
};
class ConstructorIOCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'constructor.io';
    }
    get properties() {
        return {
            api_key: {
                title: "API Key",
                type: "string"
            },
            api_token: {
                title: "API Token",
                type: "string"
            }
        };
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new ConstructorIOCommerceCodec(config).init(this);
        });
    }
}
exports.ConstructorIOCommerceCodecType = ConstructorIOCommerceCodecType;
class ConstructorIOCommerceCodec extends __1.CommerceCodec {
    // instance variables
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.init.call(this, codecType);
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield axios_1.default.get(url, {
                    baseURL: `https://ac.cnstrc.com`,
                    headers: {
                        Authorization: `Basic ${btoa(`${this.config.api_token}:`)}`
                    },
                    params: {
                        key: this.config.api_key
                    }
                })).data;
            }
            catch (error) {
                if (error.message.indexOf('429') > -1 || error.status === 429) { // rate limited, wait 10 seconds and try again
                    yield (0, util_1.sleep)(10000);
                    return yield fetch(url);
                }
            }
        });
    }
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = yield this.fetch(`/v1/item_groups`);
            this.megaMenu = categories.filter(cat => cat.parent === 'master').map(mapCategory(categories));
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield this.fetch(`/v1/item_groups&section=Products&${args.productIds.split(',').map(id => `id=${id}`).join('&')}`);
            }
            else if (args.keyword) {
                products = yield this.fetch(`/search/${args.keyword}`);
            }
            else if (args.category) {
                let browseResults = (yield this.fetch(`/browse/group_id/${args.category.slug}`)).response.results;
                return yield this.getProducts({ productIds: lodash_1.default.map(lodash_1.default.take(browseResults, 10), 'data.id').join(',') });
            }
            return products.map(prod => mapProduct(prod, this.megaMenu));
        });
    }
}
exports.ConstructorIOCommerceCodec = ConstructorIOCommerceCodec;
exports.default = ConstructorIOCommerceCodecType;
(0, __1.registerCodec)(new ConstructorIOCommerceCodecType());
