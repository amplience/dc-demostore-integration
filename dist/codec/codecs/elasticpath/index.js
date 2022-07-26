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
exports.ElasticPathCommerceCodec = exports.ElasticPathCommerceCodecType = void 0;
const common_1 = require("../../../common");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("../..");
const qs_1 = __importDefault(require("qs"));
const sdk_1 = require("@moltin/sdk");
const slugify_1 = __importDefault(require("slugify"));
const util_1 = require("../../../common/util");
class ElasticPathCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'elasticpath';
    }
    get properties() {
        return Object.assign(Object.assign(Object.assign({}, common_1.OAuthProperties), common_1.ClientCredentialProperties), { pcm_url: {
                title: "PCM URL",
                type: "string"
            }, catalog_name: {
                title: "Catalog name",
                type: "string"
            } });
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new ElasticPathCommerceCodec(config).init(this);
        });
    }
}
exports.ElasticPathCommerceCodecType = ElasticPathCommerceCodecType;
class ElasticPathCommerceCodec extends __1.CommerceCodec {
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.moltin = (0, sdk_1.gateway)({
                client_id: this.config.client_id,
                client_secret: this.config.client_secret
            });
            this.rest = (0, common_1.OAuthRestClient)(this.config, qs_1.default.stringify({
                grant_type: 'client_credentials',
                client_id: this.config.client_id,
                client_secret: this.config.client_secret
            }));
            return yield _super.init.call(this, codecType);
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.rest.get({ url });
            return response && response.data;
        });
    }
    getHierarchyRootNode(category) {
        if (category.parent) {
            const parent = this.findCategory(category.parent.slug);
            return this.getHierarchyRootNode(parent);
        }
        return category;
    }
    getFileById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(`/v2/files/${id}`);
        });
    }
    mapProduct(product) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let attributes = {};
            let images = [];
            if ((_b = (_a = product.relationships.main_image) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id) {
                let mainImage = yield this.getFileById((_d = (_c = product.relationships.main_image) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id);
                images.push({ url: (_e = mainImage === null || mainImage === void 0 ? void 0 : mainImage.link) === null || _e === void 0 ? void 0 : _e.href });
            }
            let price = yield this.getPriceForSku(product.attributes.sku);
            let productPrice = (0, util_1.formatMoneyString)(price.amount / 100, { currency: 'USD' });
            lodash_1.default.each((_f = product.attributes) === null || _f === void 0 ? void 0 : _f.extensions, (extension, key) => {
                lodash_1.default.each(extension, (v, k) => {
                    if (k.indexOf('image') > -1) {
                        images.push({ url: v });
                    }
                    else if (v) {
                        attributes[k] = v;
                    }
                });
            });
            let variants = [{
                    sku: product.attributes.sku,
                    prices: {
                        list: productPrice,
                    },
                    listPrice: productPrice,
                    salePrice: productPrice,
                    images,
                    attributes,
                    key: product.attributes.slug,
                    id: product.id
                }];
            // variants
            if (!lodash_1.default.isEmpty(product.meta.variation_matrix)) {
                let variationMatrix = product.meta.variation_matrix;
                let x = lodash_1.default.flatMap(Object.keys(variationMatrix).map(key => {
                    let variation = variationMatrix[key];
                    let z = lodash_1.default.map;
                    return {};
                }));
            }
            return {
                id: product.id,
                slug: product.attributes.slug,
                name: product.attributes.name,
                shortDescription: product.attributes.description,
                longDescription: product.attributes.description,
                categories: [],
                variants
            };
        });
    }
    getPriceForSkuInPricebook(sku, pricebookId) {
        return __awaiter(this, void 0, void 0, function* () {
            return lodash_1.default.first(yield this.fetch(`/pcm/pricebooks/${pricebookId}/prices?filter=eq(sku,string:${sku})`));
        });
    }
    getPriceForSku(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            let base = yield this.getPriceForSkuInPricebook(sku, this.catalog.attributes.pricebook_id);
            if (!base) {
                let prices = yield Promise.all(this.pricebooks.map((pricebook) => __awaiter(this, void 0, void 0, function* () { return yield this.getPriceForSkuInPricebook.bind(this)(sku, pricebook.id); })));
                base = lodash_1.default.find(prices, x => x);
            }
            return base ? {
                amount: base.attributes.currencies['USD'].amount
            } : { amount: 0 };
        });
    }
    getProductsForHierarchy(hierarchyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(`/catalog/hierarchies/${hierarchyId}/products`);
        });
    }
    getProductsForNode(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(`/catalog/nodes/${nodeId}/relationships/products`);
        });
    }
    getHierarchy(hierarchyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hierarchy = yield (yield this.moltin.Hierarchies.Get(hierarchyId)).data;
            const children = yield this.fetch(`/pcm/hierarchies/${hierarchyId}/children`);
            return {
                id: hierarchy.id,
                name: hierarchy.attributes.name,
                slug: hierarchy.attributes.slug || (0, slugify_1.default)(hierarchy.attributes.name, { lower: true }),
                children: yield Promise.all(children.map((child) => __awaiter(this, void 0, void 0, function* () { return yield this.getNode.bind(this)(hierarchy.id, child.id); }))),
                products: []
            };
        });
    }
    getNode(hierarchyId, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}`);
            const children = yield this.fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children`);
            return {
                id: node.id,
                name: node.attributes.name,
                slug: node.attributes.slug || (0, slugify_1.default)(node.attributes.name, { lower: true }),
                children: yield Promise.all(children.map((child) => __awaiter(this, void 0, void 0, function* () { return yield this.getNode.bind(this)(hierarchyId, child.id); }))),
                products: []
            };
        });
    }
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            this.catalog = lodash_1.default.find(yield (yield this.moltin.Catalogs.All()).data, cat => { var _a; return ((_a = cat.attributes) === null || _a === void 0 ? void 0 : _a.name) === this.config.catalog_name; });
            this.megaMenu = yield Promise.all(this.catalog.attributes.hierarchy_ids.map(this.getHierarchy.bind(this)));
            this.pricebooks = yield this.fetch(`/pcm/pricebooks`);
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(`/pcm/products/${productId}`);
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)));
            }
            else if (args.keyword) {
                products = yield this.fetch(`/pcm/products?filter=eq(sku,${args.keyword})`);
            }
            else if (args.category) {
                let hierarchyRoot = this.getHierarchyRootNode(args.category);
                if (hierarchyRoot.id === args.category.id) {
                    products = yield this.getProductsForHierarchy(args.category.id);
                }
                else {
                    products = yield this.getProductsForNode(args.category.id);
                }
            }
            return yield Promise.all(products.map(this.mapProduct.bind(this)));
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch(`/v2/flows/customer-group/entries`);
        });
    }
}
exports.ElasticPathCommerceCodec = ElasticPathCommerceCodec;
exports.default = ElasticPathCommerceCodecType;
(0, __1.registerCodec)(new ElasticPathCommerceCodecType());
