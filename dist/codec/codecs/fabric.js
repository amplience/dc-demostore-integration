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
exports.FabricCommerceCodec = void 0;
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("..");
const axios_1 = __importDefault(require("axios"));
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
const slugify_1 = __importDefault(require("slugify"));
const FabricRestClient = (config) => {
    let authClient = null;
    const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!authClient) {
            let authResponse = yield (0, axios_1.default)({
                url: `https://sandbox.copilot.fabric.inc/api-identity/auth/local/login`,
                method: dc_management_sdk_js_1.HttpMethod.POST,
                data: config
            });
            let accessToken = authResponse.data.accessToken;
            authClient = axios_1.default.create({
                headers: {
                    Authorization: accessToken
                }
            });
            setTimeout(() => { authenticate(); }, 600000);
        }
    });
    return {
        get: (request) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield authClient(request)).data;
        }),
        authenticate
    };
};
const mapCategory = category => ({
    id: category.id,
    key: (0, slugify_1.default)(category.name, { lower: true }),
    slug: (0, slugify_1.default)(category.name, { lower: true }),
    name: category.name,
    children: category.children.map(mapCategory),
    products: []
});
let rest = undefined;
let megaMenu = undefined;
const expandCategory = (category) => [category, ...lodash_1.default.flatMapDeep(category.children, expandCategory)];
const locateCategoryForKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return lodash_1.default.find(lodash_1.default.flatMapDeep(megaMenu, expandCategory), c => c.key === key);
});
class FabricCommerceCodec extends __1.Codec {
    // constructor(config: FabricCommerceCodecConfig) {
    //     super(config)
    //     if (!rest) {
    //         rest = FabricRestClient(config)
    //     }
    // }
    // async start() {
    //     await rest.authenticate()
    //     console.log(`authenticated to [ fabric ]`)
    // }
    // commerce codec api implementation
    getProduct(context) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`product no!`);
        });
    }
    getProducts(context) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`products no!`);
        });
    }
    getCategory(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield locateCategoryForKey(context.args.key);
            let x = yield rest.get({
                url: `https://sandbox.copilot.fabric.inc/api-pim2/v1/item/search`,
                method: dc_management_sdk_js_1.HttpMethod.POST,
                data: {
                    "page": 0,
                    "size": 50,
                    "sort": [
                        {
                            "direction": "DESC",
                            "field": "createdOn"
                        }
                    ],
                    "exclude": {
                        "files": true,
                        "statuses": true
                    },
                    "match": {
                        "and": [
                            {
                                "ancestorId": category.id,
                                "type": "ITEM",
                                "parentId": null
                            }
                        ]
                    }
                },
                headers: {
                    'content-type': 'application/json'
                }
            });
            category.products = lodash_1.default.map(x.items, (prod) => {
                const attributes = lodash_1.default.map(prod.attributes, (a) => ({ name: a.name, value: a.valueText }));
                const productName = lodash_1.default.find(attributes, att => att.name === 'title').value;
                return {
                    id: prod.itemId,
                    name: productName,
                    slug: (0, slugify_1.default)(productName, { lower: true }),
                    key: (0, slugify_1.default)(productName, { lower: true }),
                    productType: prod.type,
                    shortDescription: '',
                    longDescription: '',
                    categories: [],
                    variants: [{
                            id: prod.itemId,
                            sku: lodash_1.default.find(attributes, att => att.name === 'sku').value,
                            images: [{
                                    url: lodash_1.default.find(attributes, att => att.name === 'Image 1').value
                                }],
                            prices: {},
                            listPrice: '',
                            salePrice: '',
                            attributes,
                            key: ''
                        }]
                };
            });
            console.log(JSON.stringify(lodash_1.default.first(category.products), undefined, 4));
            return category;
        });
    }
    getMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!megaMenu) {
                // the 'categories[0].children' of the node returned from this URL are the top level categories
                let categories = lodash_1.default.get(yield rest.get({ url: `https://sandbox.copilot.fabric.inc/api-category/v1/category?page=1&size=100&type=ALL` }), 'categories[0].children');
                if (categories) {
                    return megaMenu = categories.map(mapCategory);
                }
                else {
                    throw new Error('megaMenu node not found');
                }
            }
        });
    }
}
exports.FabricCommerceCodec = FabricCommerceCodec;
exports.default = {
    // codec generator conformance
    SchemaURI: 'https://demostore.amplience.com/site/integration/fabric',
    // getInstance: async (config) => {
    //     let codec = new FabricCommerceCodec(config)
    //     await codec.start()
    //     return codec
    // }
    // end codec generator conformance
};
