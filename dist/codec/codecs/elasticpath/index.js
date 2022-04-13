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
const types_1 = require("../../../types");
const __1 = require("../..");
const rest_client_1 = __importDefault(require("../../../common/rest-client"));
const mappers_1 = __importDefault(require("./mappers"));
const common_1 = require("../common");
const epCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/elasticpath',
    getAPI: function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = (0, rest_client_1.default)(config);
            yield rest.authenticate({
                grant_type: 'client_credentials',
                client_id: config.client_id,
                client_secret: config.client_secret
            });
            const fetch = (url) => __awaiter(this, void 0, void 0, function* () { return (yield rest.get({ url })).data; });
            const api = {
                getProductById: (id) => fetch(`/pcm/products/${id}`),
                getProductBySku: (sku) => __awaiter(this, void 0, void 0, function* () { return lodash_1.default.first(yield fetch(`/pcm/products/?filter=like(sku,string:${sku})`)); }),
                getFileById: (id) => fetch(`/v2/files/${id}`),
                getPricebooks: () => fetch(`/pcm/pricebooks`),
                getPricebookById: (id) => fetch(`/pcm/pricebooks/${id}`),
                getHierarchyById: (id) => fetch(`/pcm/hierarchies/${id}`),
                getPriceForSkuInPricebook: (sku, pricebook) => __awaiter(this, void 0, void 0, function* () { return lodash_1.default.first((yield rest.get({ url: `/pcm/pricebooks/${pricebook.id}/prices?filter=eq(sku,string:${sku})` })).data); }),
                getPriceForSku: (sku) => __awaiter(this, void 0, void 0, function* () {
                    let prices = yield api.getPricesForSku(sku);
                    let priceBookPrice = lodash_1.default.find(prices, (price) => { var _a; return price.pricebook.id === catalog.attributes.pricebook_id && !!((_a = price.attributes) === null || _a === void 0 ? void 0 : _a.currencies); }) ||
                        lodash_1.default.find(prices, price => { var _a; return !!((_a = price.attributes) === null || _a === void 0 ? void 0 : _a.currencies); });
                    return Object.assign(Object.assign({}, priceBookPrice === null || priceBookPrice === void 0 ? void 0 : priceBookPrice.attributes.currencies['USD']), { currency: 'USD' });
                }),
                getPricesForSku: (sku) => __awaiter(this, void 0, void 0, function* () {
                    return yield Promise.all((yield api.getPricebooks()).map((pricebook) => __awaiter(this, void 0, void 0, function* () {
                        return (Object.assign(Object.assign({}, yield api.getPriceForSkuInPricebook(sku, pricebook)), { pricebook }));
                    })));
                }),
                getCatalog: (name) => __awaiter(this, void 0, void 0, function* () {
                    let catalogs = (yield rest.get({ url: '/catalogs' })).data;
                    return lodash_1.default.find(catalogs, cat => { var _a; return ((_a = cat.attributes) === null || _a === void 0 ? void 0 : _a.name) === name; });
                }),
                getMegaMenu: (name) => __awaiter(this, void 0, void 0, function* () {
                    return yield Promise.all((yield api.getCatalog(name)).attributes.hierarchy_ids.map(yield api.getHierarchyById));
                }),
                getProductsByNodeId: (hierarchyId, nodeId) => __awaiter(this, void 0, void 0, function* () {
                    return (yield rest.get({ url: `/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/products` })).data;
                }),
                getChildrenByHierarchyId: (id) => __awaiter(this, void 0, void 0, function* () {
                    return (yield rest.get({ url: `/pcm/hierarchies/${id}/children` })).data;
                }),
                getChildrenByNodeId: (hierarchyId, nodeId) => __awaiter(this, void 0, void 0, function* () {
                    return (yield rest.get({ url: `/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children` })).data;
                })
            };
            let catalog = yield api.getCatalog(config.catalog_name);
            let mapper = (0, mappers_1.default)(api);
            let megaMenu = yield Promise.all((yield api.getMegaMenu(config.catalog_name)).map(yield mapper.mapHierarchy));
            const populateCategory = (category) => __awaiter(this, void 0, void 0, function* () {
                return (Object.assign(Object.assign({}, category), { products: yield getProductsFromCategory(category) }));
            });
            const getProductsFromCategory = (category) => __awaiter(this, void 0, void 0, function* () {
                let products = [];
                if (category.id === category.hierarchyId) {
                    products = lodash_1.default.flatten(yield Promise.all(category.children.map((child) => __awaiter(this, void 0, void 0, function* () { return yield api.getProductsByNodeId(category.hierarchyId, child.id); }))));
                }
                else if (category.hierarchyId) {
                    products = yield api.getProductsByNodeId(category.hierarchyId, category.id);
                }
                return yield Promise.all(products.map(yield mapper.mapProduct));
            });
            return {
                getProduct: function (query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (query.args.id) {
                            return mapper.mapProduct(yield api.getProductById(query.args.id));
                        }
                        throw new Error(`getProduct(): must specify id`);
                    });
                },
                getProducts: function (query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (query.args.productIds) {
                            return yield Promise.all(query.args.productIds.split(',').map((productId) => __awaiter(this, void 0, void 0, function* () {
                                return yield this.getProduct((0, types_1.qc)({ args: { id: productId } }));
                            })));
                        }
                        else if (query.args.keyword) {
                            // ep does not yet have keyword search enabled. so for the time being, we are emulating it with sku search
                            return [yield mapper.mapProduct(yield api.getProductBySku(query.args.keyword))];
                        }
                        throw new Error(`getProducts(): must specify either productIds or keyword`);
                    });
                },
                getCategory: function (query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!query.args.slug) {
                            throw new Error(`getCategory(): must specify slug`);
                        }
                        return yield populateCategory((0, common_1.findInMegaMenu)(megaMenu, query.args.slug));
                    });
                },
                getMegaMenu: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return megaMenu;
                    });
                },
                getCustomerGroups: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return [];
                    });
                }
            };
        });
    },
    canUseConfiguration: function (config) {
        return config.client_id && config.client_secret && config.pcm_url && config.auth_url && config.api_url && config.catalog_name;
    }
};
exports.default = epCodec;
(0, __1.registerCodec)(epCodec);
