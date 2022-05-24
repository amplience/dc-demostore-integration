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
const __1 = require("../..");
const index_1 = require("../../index");
const common_1 = require("../common");
const slugify_1 = __importDefault(require("slugify"));
const properties = {
    api_key: {
        title: "API Key",
        type: "string"
    },
    api_token: {
        title: "API Token",
        type: "string"
    }
};
const constructorIOCodec = {
    schema: {
        type: index_1.CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/constructor.io',
        icon: 'https://media.glassdoor.com/sqll/2176466/constructor-io-squarelogo-1539215018600.png',
        properties
    },
    getAPI: function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            const ConstructorIOClient = require('@constructor-io/constructorio-node');
            const constructorio = new ConstructorIOClient({
                apiKey: config.api_key,
                apiToken: config.api_token
            });
            const mapCategory = (category) => ({
                id: category.id,
                slug: category.id,
                name: category.name,
                children: category.children.map(mapCategory),
                products: []
            });
            const mapProduct = (product) => {
                var _a, _b;
                return ({
                    id: product.id,
                    name: product.name,
                    slug: (0, slugify_1.default)(product.name, { lower: true }),
                    categories: product.group_ids.map(gid => (0, common_1.findInMegaMenu)(megaMenu, gid)),
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
                });
            };
            let categories = yield constructorio.catalog.getItemGroups();
            let megaMenu = categories.item_groups.map(mapCategory);
            const api = {
                getProductById: (productId) => __awaiter(this, void 0, void 0, function* () {
                    return mapProduct(yield constructorio.catalog.getItem({ id: productId, section: 'Products' }));
                }),
                getProduct: (args) => __awaiter(this, void 0, void 0, function* () {
                    return api.getProductById(args.id);
                }),
                getProducts: (args) => __awaiter(this, void 0, void 0, function* () {
                    let productIds = [];
                    if (args.productIds) {
                        productIds = args.productIds.split(',');
                    }
                    else if (args.keyword) {
                        let raw = (yield constructorio.search.getSearchResults(args.keyword)).response.results;
                        productIds = raw.map(r => r.data.id);
                    }
                    return yield Promise.all(productIds.map(api.getProductById));
                }),
                getCategory: (args) => __awaiter(this, void 0, void 0, function* () {
                    return yield api.populateCategory((0, common_1.findInMegaMenu)(megaMenu, args.slug));
                }),
                populateCategory: (category) => __awaiter(this, void 0, void 0, function* () {
                    if (!category) {
                        return;
                    }
                    let browseResults = (yield constructorio.browse.getBrowseResults('group_id', category.slug)).response.results;
                    return Object.assign(Object.assign({}, category), { products: yield api.getProducts({ productIds: lodash_1.default.map(lodash_1.default.take(browseResults, 10), 'data.id').join(',') }) });
                }),
                getMegaMenu: () => __awaiter(this, void 0, void 0, function* () {
                    return megaMenu;
                }),
                getCustomerGroups: () => __awaiter(this, void 0, void 0, function* () {
                    return [];
                })
            };
            return api;
        });
    }
};
(0, __1.registerCodec)(constructorIOCodec);
