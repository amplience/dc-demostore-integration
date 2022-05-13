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
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("../common");
const axios_1 = __importDefault(require("axios"));
const slugify_1 = __importDefault(require("slugify"));
const rest_client_1 = require("../../../common/rest-client");
const properties = Object.assign(Object.assign({}, rest_client_1.APIProperties), { catalog_id: {
        title: "Catalog ID",
        type: "string"
    } });
const mapCategory = (category) => (Object.assign(Object.assign({}, category), { slug: (0, slugify_1.default)(category.name, { lower: true }), children: category.subcategories.map(mapCategory), products: [] }));
const mapProduct = (product) => (Object.assign(Object.assign({}, product), { id: product.code, slug: (0, slugify_1.default)(product.name, { lower: true }), longDescription: product.description, categories: [], variants: [{
            sku: product.code,
            listPrice: product.price.formattedValue,
            salePrice: '',
            images: [],
            attributes: lodash_1.default.zipObject(Object.keys(product), Object.values(product))
        }] }));
let megaMenu;
const hybrisCodec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/hybris',
        icon: 'https://images.squarespace-cdn.com/content/v1/54dd763ce4b01f6b05bab7db/1511645929126-9BGFQ3VFVOQX75PHZ7JS/logos-014__2_.png',
        properties
    },
    getAPI: function (config) {
        if (!config.catalog_id) {
            return null;
        }
        const rest = axios_1.default.create({
            baseURL: `${config.api_url}/occ/v2/${config.catalog_id}`
        });
        const fetch = (url) => __awaiter(this, void 0, void 0, function* () { return yield (yield rest.get(url)).data; });
        const populate = function (category) {
            return __awaiter(this, void 0, void 0, function* () {
                return Object.assign(Object.assign({}, category), { products: (yield fetch(`/categories/${category.id}/products?fields=FULL`)).products.map(mapProduct) });
            });
        };
        // CommerceAPI implementation
        const getProduct = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                return mapProduct(yield fetch(`/products/${args.id}?fields=FULL`));
            });
        };
        const getProducts = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (args.productIds) {
                    return yield Promise.all(args.productIds.split(',').map((id) => __awaiter(this, void 0, void 0, function* () { return yield getProduct({ id }); })));
                }
                else if (args.keyword) {
                    return (yield fetch(`/products/search?query=${args.keyword}&fields=FULL`)).map(mapProduct);
                }
            });
        };
        const getCategory = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield populate((0, common_1.findInMegaMenu)(yield getMegaMenu(args), args.slug));
            });
        };
        const getMegaMenu = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!megaMenu) {
                    megaMenu = mapCategory((yield rest.get(`/catalogs/${config.catalog_id}ProductCatalog/Online/categories/1`)).data).children;
                }
                return megaMenu;
            });
        };
        const getCustomerGroups = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                // don't know where these will come from
                return [];
            });
        };
        // end CommerceAPI implementation
        return {
            getProduct,
            getProducts,
            getCategory,
            getMegaMenu,
            getCustomerGroups
        };
    }
};
exports.default = hybrisCodec;
