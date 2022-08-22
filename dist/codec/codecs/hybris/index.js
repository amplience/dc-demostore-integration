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
exports.HybrisCommerceCodec = exports.HybrisCommerceCodecType = void 0;
const common_1 = require("../../../common");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("../..");
const slugify_1 = __importDefault(require("slugify"));
const axios_1 = __importDefault(require("axios"));
class HybrisCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'hybris';
    }
    get properties() {
        return Object.assign(Object.assign({}, common_1.APIProperties), { catalog_id: {
                title: "Catalog ID",
                type: "string",
                minLength: 1
            } });
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new HybrisCommerceCodec(config).init(this);
        });
    }
}
exports.HybrisCommerceCodecType = HybrisCommerceCodecType;
const mapCategory = (category) => (Object.assign(Object.assign({}, category), { slug: (0, slugify_1.default)(category.name, { lower: true }), children: category.subcategories.map(mapCategory), products: [] }));
const mapProduct = (product) => (Object.assign(Object.assign({}, product), { id: product.code, slug: (0, slugify_1.default)(product.name, { lower: true }), longDescription: product.description, categories: [], variants: [{
            sku: product.code,
            listPrice: product.price.formattedValue,
            salePrice: '',
            images: [],
            attributes: lodash_1.default.zipObject(Object.keys(product), Object.values(product))
        }] }));
class HybrisCommerceCodec extends __1.CommerceCodec {
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.rest = axios_1.default.create({ baseURL: `${this.config.api_url}/occ/v2/${this.config.catalog_id}` });
            return yield _super.init.call(this, codecType);
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.rest.get(url)).data;
        });
    }
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            this.megaMenu = mapCategory((yield this.rest.get(`/catalogs/${this.config.catalog_id}ProductCatalog/Online/categories/1`)).data).children;
            return null;
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(`/products/${id}?fields=FULL`);
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)));
            }
            else if (args.keyword) {
                products = (yield this.fetch(`/products/search?query=${args.keyword}&fields=FULL`)).products;
            }
            else if (args.category) {
                products = (yield this.fetch(`/categories/${args.category.id}/products?fields=FULL`)).products;
            }
            return products.map(mapProduct);
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.HybrisCommerceCodec = HybrisCommerceCodec;
exports.default = HybrisCommerceCodecType;
// registerCodec(new HybrisCommerceCodecType())
