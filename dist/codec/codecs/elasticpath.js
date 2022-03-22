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
exports.ElasticPathCommerceCodec = void 0;
const lodash_1 = __importDefault(require("lodash"));
const types_1 = require("../../types");
const __1 = require("..");
const rest_client_1 = __importDefault(require("../../common/rest-client"));
const util_1 = require("../../util");
const api = {
    getProductById: (id) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url: `/pcm/products/${id}` })).data; }),
    getFileById: (id) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url: `/v2/files/${id}` })).data; }),
    getPrices: (name) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let retailPricebook = lodash_1.default.find((yield rest.get({ url: `/pcm/pricebooks` })).data, pb => pb.attributes.name === name);
        if (retailPricebook) {
            return (_a = (yield rest.get({ url: `/pcm/pricebooks/${retailPricebook.id}/prices` }))) === null || _a === void 0 ? void 0 : _a.data;
        }
        return [];
    }),
    getMegaMenu: (name) => __awaiter(void 0, void 0, void 0, function* () {
        let catalogs = (yield rest.get({ url: '/catalogs' })).data;
        let catalog = lodash_1.default.find(catalogs, cat => { var _a; return ((_a = cat.attributes) === null || _a === void 0 ? void 0 : _a.name) === name; });
        return yield Promise.all(catalog.attributes.hierarchy_ids.map((id) => __awaiter(void 0, void 0, void 0, function* () { return (yield rest.get({ url: `/pcm/hierarchies/${id}` })).data; })));
    }),
    getProductsByNodeId: (hierarchyId, nodeId) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield rest.get({ url: `/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/products` })).data;
    }),
    getChildrenByHierarchyId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield rest.get({ url: `/pcm/hierarchies/${id}/children` })).data;
    }),
    getChildrenByNodeId: (hierarchyId, nodeId) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield rest.get({ url: `/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children` })).data;
    })
};
let rest = undefined;
// mappers
const mapProduct = (skeletonProduct) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (!skeletonProduct) {
        return undefined;
    }
    let product = yield api.getProductById(skeletonProduct.id);
    if (!product) {
        return undefined;
    }
    let attributes = [];
    let images = [];
    if ((_c = (_b = product.relationships.main_image) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id) {
        let mainImage = yield api.getFileById((_e = (_d = product.relationships.main_image) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.id);
        images.push({ url: (_f = mainImage === null || mainImage === void 0 ? void 0 : mainImage.link) === null || _f === void 0 ? void 0 : _f.href });
    }
    let productPrice = (_j = (_h = (_g = product.attributes) === null || _g === void 0 ? void 0 : _g.price) === null || _h === void 0 ? void 0 : _h.USD) === null || _j === void 0 ? void 0 : _j.amount;
    let prices = yield api.getPrices('Retail Pricing');
    let price = lodash_1.default.find(prices, price => { var _a, _b; return ((_a = price.attributes.sku) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_b = product.attributes.sku) === null || _b === void 0 ? void 0 : _b.toLowerCase()); });
    productPrice = util_1.formatMoneyString(((_k = price === null || price === void 0 ? void 0 : price.attributes.currencies.USD) === null || _k === void 0 ? void 0 : _k.amount) / 100, { currency: 'USD' });
    lodash_1.default.each((_l = product.attributes) === null || _l === void 0 ? void 0 : _l.extensions, (extension, key) => {
        lodash_1.default.each(extension, (v, k) => {
            if (k.indexOf('image') > -1) {
                images.push({ url: v });
            }
            else if (v) {
                attributes.push({ name: k, value: v });
            }
        });
    });
    return {
        id: product.id,
        slug: product.attributes.slug,
        key: product.attributes.slug,
        name: product.attributes.name,
        shortDescription: product.attributes.description,
        productType: product.type,
        categories: [],
        variants: [{
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
            }]
    };
});
const mapNode = (hierarchy) => (node) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        hierarchyId: hierarchy.id,
        name: node.attributes.name,
        id: node.id,
        slug: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
        key: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
        children: yield Promise.all((yield api.getChildrenByNodeId(hierarchy.id, node.id)).map(yield mapNode(hierarchy))),
        products: []
    });
});
const mapHierarchy = (hierarchy) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        hierarchyId: hierarchy.id,
        name: hierarchy.attributes.name,
        id: hierarchy.id,
        slug: hierarchy.attributes.slug,
        key: hierarchy.attributes.slug,
        children: yield Promise.all((yield api.getChildrenByHierarchyId(hierarchy.id)).map(yield mapNode(hierarchy))),
        products: []
    });
});
// end mappers
// utility methods
const populateCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    return (Object.assign(Object.assign({}, category), { products: yield getProductsFromCategory(category) }));
});
const getProductsFromCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    if (category.id === category.hierarchyId) {
        products = lodash_1.default.flatten(yield Promise.all(category.children.map((child) => __awaiter(void 0, void 0, void 0, function* () { return yield api.getProductsByNodeId(category.hierarchyId, child.id); }))));
    }
    else if (category.hierarchyId) {
        products = yield api.getProductsByNodeId(category.hierarchyId, category.id);
    }
    return yield Promise.all(products.map(yield mapProduct));
});
const expandCategory = (category) => [category, ...lodash_1.default.flatMapDeep(category.children, expandCategory)];
const locateCategoryForKey = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    let category = lodash_1.default.find(lodash_1.default.flatMapDeep(megaMenu, expandCategory), c => c.slug === slug);
    return yield populateCategory(category);
});
// end utility methods
let megaMenu = [];
class ElasticPathCommerceCodec extends __1.Codec {
    constructor(config) {
        super(config);
        if (!rest) {
            rest = rest_client_1.default(config);
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield rest.authenticate();
            megaMenu = yield Promise.all((yield api.getMegaMenu('Teacher Specials')).map(yield mapHierarchy));
        });
    }
    // commerce codec api implementation
    getProduct(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mapProduct(yield api.getProductById(context.args.id));
        });
    }
    getProducts(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.args.productIds) {
                return yield Promise.all(context.args.productIds.split(',').map((productId) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.getProduct(new types_1.QueryContext({ args: { id: productId } }));
                })));
            }
            else if (context.args.keyword) {
                console.warn(`keyword search not available in elasticpath`);
                return [];
            }
            throw new Error(`[ ep ] keyword or productIds required`);
        });
    }
    getCategory(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield locateCategoryForKey(context.args.key);
        });
    }
    getMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return megaMenu;
        });
    }
}
exports.ElasticPathCommerceCodec = ElasticPathCommerceCodec;
exports.default = {
    // codec generator conformance
    SchemaURI: 'https://amprsa.net/site/integration/elasticpath',
    getInstance: (config) => __awaiter(void 0, void 0, void 0, function* () {
        let codec = new ElasticPathCommerceCodec(config);
        yield codec.start();
        return codec;
    })
    // end codec generator conformance
};
