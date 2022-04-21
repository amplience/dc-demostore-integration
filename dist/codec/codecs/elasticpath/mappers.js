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
const util_1 = require("../../../util");
const lodash_1 = __importDefault(require("lodash"));
const mappers = (api) => {
    const mapProduct = (skeletonProduct) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        if (!skeletonProduct) {
            return undefined;
        }
        let product = yield api.getProductById(skeletonProduct.id);
        if (!product) {
            return undefined;
        }
        // let attributes: Attribute[] = []
        let attributes = {};
        let images = [];
        if ((_b = (_a = product.relationships.main_image) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id) {
            let mainImage = yield api.getFileById((_d = (_c = product.relationships.main_image) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id);
            images.push({ url: (_e = mainImage === null || mainImage === void 0 ? void 0 : mainImage.link) === null || _e === void 0 ? void 0 : _e.href });
        }
        let price = yield api.getPriceForSku(product.attributes.sku);
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
    const mapNode = (hierarchy) => (node) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            hierarchyId: hierarchy.id,
            name: node.attributes.name,
            id: node.id,
            slug: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
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
            children: yield Promise.all((yield api.getChildrenByHierarchyId(hierarchy.id)).map(yield mapNode(hierarchy))),
            products: []
        });
    });
    const mapCustomerGroup = (customerGroup) => (Object.assign(Object.assign({}, customerGroup), { name: customerGroup['group-name'] }));
    // end mappers    
    return {
        mapHierarchy,
        mapNode,
        mapProduct,
        mapCustomerGroup
    };
};
exports.default = mappers;
