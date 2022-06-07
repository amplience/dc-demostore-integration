"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const rest_client_1 = __importStar(require("../../../common/rest-client"));
const mappers_1 = __importDefault(require("./mappers"));
const common_1 = require("../common");
const qs_1 = __importDefault(require("qs"));
const properties = Object.assign(Object.assign(Object.assign({}, rest_client_1.OAuthProperties), rest_client_1.ClientCredentialProperties), { pcm_url: {
        title: "PCM URL",
        type: "string"
    }, catalog_name: {
        title: "Catalog name",
        type: "string"
    } });
const epCodec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/elasticpath',
        icon: 'https://pbs.twimg.com/profile_images/1138115910449844226/PBnkfVHY_400x400.png',
        properties
    },
    getAPI: (config) => __awaiter(void 0, void 0, void 0, function* () {
        if (!config.pcm_url) {
            return null;
        }
        const rest = (0, rest_client_1.default)(config, qs_1.default.stringify({
            grant_type: 'client_credentials',
            client_id: config.client_id,
            client_secret: config.client_secret
        }));
        const fetch = (url) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url })).data; });
        let catalog = lodash_1.default.find((yield fetch(`catalogs`)), cat => { var _a; return ((_a = cat.attributes) === null || _a === void 0 ? void 0 : _a.name) === config.catalog_name; });
        const api = {
            getProductById: (id) => fetch(`/pcm/products/${id}`),
            getProductBySku: (sku) => __awaiter(void 0, void 0, void 0, function* () { return lodash_1.default.first(yield fetch(`/pcm/products/?filter=like(sku,string:${sku})`)); }),
            getFileById: (id) => fetch(`/v2/files/${id}`),
            getPricebooks: () => fetch(`/pcm/pricebooks`),
            getPricebookById: (id) => fetch(`/pcm/pricebooks/${id}`),
            getHierarchyById: (id) => fetch(`/pcm/hierarchies/${id}`),
            getPriceForSkuInPricebook: (sku, pricebook) => __awaiter(void 0, void 0, void 0, function* () { return lodash_1.default.first(yield fetch(`/pcm/pricebooks/${pricebook.id}/prices?filter=eq(sku,string:${sku})`)); }),
            getPriceForSku: (sku) => __awaiter(void 0, void 0, void 0, function* () {
                let cat = yield api.getCatalog();
                let prices = yield api.getPricesForSku(sku);
                let priceBookPrice = lodash_1.default.find(prices, (price) => { var _a; return price.pricebook.id === cat.attributes.pricebook_id && !!((_a = price.attributes) === null || _a === void 0 ? void 0 : _a.currencies); }) ||
                    lodash_1.default.find(prices, price => { var _a; return !!((_a = price.attributes) === null || _a === void 0 ? void 0 : _a.currencies); });
                return Object.assign(Object.assign({}, priceBookPrice === null || priceBookPrice === void 0 ? void 0 : priceBookPrice.attributes.currencies['USD']), { currency: 'USD' });
            }),
            getPricesForSku: (sku) => __awaiter(void 0, void 0, void 0, function* () {
                return yield Promise.all((yield api.getPricebooks()).map((pricebook) => __awaiter(void 0, void 0, void 0, function* () {
                    return (Object.assign(Object.assign({}, yield api.getPriceForSkuInPricebook(sku, pricebook)), { pricebook }));
                })));
            }),
            getCatalog: () => __awaiter(void 0, void 0, void 0, function* () {
                return catalog;
            }),
            getMegaMenu: () => __awaiter(void 0, void 0, void 0, function* () {
                return yield Promise.all((yield api.getCatalog()).attributes.hierarchy_ids.map(yield api.getHierarchyById));
            }),
            getProductsByNodeId: (hierarchyId, nodeId) => fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/products`),
            getChildrenByHierarchyId: (id) => fetch(`/pcm/hierarchies/${id}/children`),
            getChildrenByNodeId: (hierarchyId, nodeId) => fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children`),
            getCustomerGroups: () => fetch(`/v2/flows/customer-group/entries`)
        };
        // _.each(Object.keys(api), key => {
        //     let method = api[key]
        //     api[key] = async (...args) => {
        //         let start = new Date().valueOf()
        //         let result = await method(...args)
        //         console.log(`${key}: ${new Date().valueOf() - start}ms`)
        //         return result
        //     }
        // })
        const mapper = (0, mappers_1.default)(api);
        let megaMenu = yield Promise.all((yield api.getMegaMenu()).map(yield mapper.mapHierarchy));
        const populateCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
            return (Object.assign(Object.assign({}, category), { products: yield getProductsFromCategory(category) }));
        });
        const getProductsFromCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
            let products = [];
            if (category.id === category.hierarchyId) {
                products = lodash_1.default.uniqBy(lodash_1.default.flatten(lodash_1.default.take(yield Promise.all(category.children.map((child) => __awaiter(void 0, void 0, void 0, function* () { return yield api.getProductsByNodeId(category.hierarchyId, child.id); }))), 1)), x => x.id);
            }
            else if (category.hierarchyId) {
                products = yield api.getProductsByNodeId(category.hierarchyId, category.id);
            }
            return yield Promise.all(products.map(yield mapper.mapProduct));
        });
        // CommerceAPI
        const getProduct = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (args.id) {
                    return mapper.mapProduct(yield api.getProductById(args.id));
                }
                throw new Error(`getProduct(): must specify id`);
            });
        };
        const getProducts = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (args.productIds) {
                    return yield Promise.all(args.productIds.split(',').map((id) => __awaiter(this, void 0, void 0, function* () { return yield getProduct({ id }); })));
                }
                else if (args.keyword) {
                    // ep does not yet have keyword search enabled. so for the time being, we are emulating it with sku search
                    return [yield mapper.mapProduct(yield api.getProductBySku(args.keyword))];
                }
                throw new Error(`getProducts(): must specify either productIds or keyword`);
            });
        };
        const getCategory = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!args.slug) {
                    throw new Error(`getCategory(): must specify slug`);
                }
                let category = (0, common_1.findInMegaMenu)(yield getMegaMenu(), args.slug);
                let populated = yield populateCategory(category);
                return populated;
            });
        };
        const getMegaMenu = function () {
            return __awaiter(this, void 0, void 0, function* () {
                return megaMenu;
            });
        };
        const getCustomerGroups = function () {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield api.getCustomerGroups()).map(mapper.mapCustomerGroup);
            });
        };
        // end CommerceAPI
        return {
            getProduct,
            getProducts,
            getCategory,
            getMegaMenu,
            getCustomerGroups
        };
    })
};
exports.default = epCodec;
