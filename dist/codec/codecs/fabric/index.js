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
exports.FabricCommerceCodec = exports.FabricCommerceCodecType = void 0;
const common_1 = require("../../../common");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("../..");
const mappers_1 = require("./mappers");
class FabricCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'fabric';
    }
    get properties() {
        return Object.assign(Object.assign(Object.assign({}, common_1.OAuthProperties), common_1.UsernamePasswordProperties), { accountId: {
                title: "Account ID",
                type: "string",
                minLength: 1
            }, accountKey: {
                title: "Account Key",
                type: "string",
                minLength: 1
            }, stage: {
                title: "Stage",
                type: "string",
                minLength: 1
            } });
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new FabricCommerceCodec(config).init(this);
        });
    }
}
exports.FabricCommerceCodecType = FabricCommerceCodecType;
class FabricCommerceCodec extends __1.CommerceCodec {
    // instance variables
    // products: Product[]
    // categories: Category[]
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.rest = (0, common_1.OAuthRestClient)(this.config, this.config, {
                headers: {
                    'content-type': 'application/json'
                }
            }, (auth) => {
                return {
                    Authorization: auth.accessToken,
                    // todo: what comprises site-context?
                    // todo: what do we need to remove (abstract) from here?  account?  stage?
                    'x-site-context': JSON.stringify({
                        stage: this.config.stage,
                        account: this.config.accountKey,
                        date: new Date().toISOString(),
                        channel: 12
                    })
                };
            });
            return yield _super.init.call(this, codecType);
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rest.get({ url });
        });
    }
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            // the 'categories[0].children' of the node returned from this URL are the top level categories
            let categories = lodash_1.default.get(yield this.fetch(`/api-category/v1/category?page=1&size=1&type=ALL`), 'categories[0].children');
            if (!categories) {
                throw new Error('megaMenu node not found');
            }
            this.megaMenu = categories.map(mappers_1.mapCategory);
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = (yield this.fetch(`/api-product/v1/product/search?query=[${args.productIds}]`)).products;
            }
            else if (args.keyword) {
                products = (yield this.fetch(`/api-product/v1/product/search?query=${args.keyword}`)).products;
            }
            else if (args.category) {
                let skus = lodash_1.default.take(lodash_1.default.get(yield this.fetch(`/api-category/v1/category/sku?id=${args.category.id}`), 'skus'), 20);
                products = (yield this.fetch(`/api-product/v1/product/search?query=[${skus.join(',')}]`)).products;
            }
            yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
                product.attributes = (yield this.fetch(`/api-product/v1/product/attribute?sku=${product.sku}`)).attributes;
            })));
            return products.map(mappers_1.mapProduct);
        });
    }
}
exports.FabricCommerceCodec = FabricCommerceCodec;
exports.default = FabricCommerceCodecType;
// registerCodec(new FabricCommerceCodecType())
