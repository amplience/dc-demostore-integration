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
const rest_client_1 = __importDefault(require("../../../common/rest-client"));
const slugify_1 = __importDefault(require("slugify"));
const common_1 = require("../common");
let megaMenu;
const fabricCodec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/fabric',
        icon: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/qhb7eb9tdr9qf2xzy8w5',
        properties: {
            "username": {
                "title": "Username",
                "type": "string",
                "minLength": 0,
                "maxLength": 50
            },
            "password": {
                "title": "Password",
                "type": "string",
                "minLength": 0,
                "maxLength": 200
            },
            "accountId": {
                "title": "Account ID",
                "type": "string",
                "minLength": 0,
                "maxLength": 50
            }
        }
    },
    getAPI: function (config) {
        if (!config.username) {
            return null;
        }
        const rest = (0, rest_client_1.default)(Object.assign(Object.assign({}, config), { auth_url: `https://sandbox.copilot.fabric.inc/api-identity/auth/local/login` }), {
            username: config.username,
            password: config.password,
            accountId: config.accountId
        }, {
            headers: {
                'content-type': 'application/json'
            }
        }, (auth) => {
            return {
                Authorization: auth.accessToken,
                // todo: what comprises site-context?
                'x-site-context': JSON.stringify({
                    "stage": "sandbox",
                    "account": "62095c9437d1c60011d8c3cf",
                    "date": "2021-07-19T23:41:54.179Z",
                    "channel": 12
                })
            };
        });
        const fetch = (url) => __awaiter(this, void 0, void 0, function* () { return yield rest.get({ url }); });
        const getProductAttributes = function (sku) {
            return __awaiter(this, void 0, void 0, function* () {
                return lodash_1.default.get(yield fetch(`/api-product/v1/product/attribute?sku=${sku}`), 'attributes');
            });
        };
        const getProductsForCategory = function (category) {
            return __awaiter(this, void 0, void 0, function* () {
                let skus = lodash_1.default.take(lodash_1.default.get(yield fetch(`/api-category/v1/category/sku?id=${category.id}`), 'skus'), 20);
                return lodash_1.default.isEmpty(skus) ? [] : yield getProducts({ productIds: skus.join(',') });
            });
        };
        const mapCategory = (category) => ({
            id: category.id,
            slug: (0, slugify_1.default)(category.name, { lower: true }),
            name: category.name,
            children: category.children.map(mapCategory),
            products: []
        });
        const mapProduct = (product) => __awaiter(this, void 0, void 0, function* () {
            let attributes = yield getProductAttributes(product.sku);
            const getAttributeValue = name => attributes.find(att => att.name === name).value;
            let name = getAttributeValue('title');
            return {
                id: product._id,
                name,
                longDescription: getAttributeValue('description'),
                slug: (0, slugify_1.default)(name, { lower: true }),
                categories: [],
                variants: [{
                        sku: product.sku,
                        listPrice: '--',
                        salePrice: '--',
                        images: [
                            { url: getAttributeValue('Image 1') },
                            ...JSON.parse(getAttributeValue('ImageArray'))
                        ],
                        attributes: lodash_1.default.zipObject(lodash_1.default.map(attributes, 'name'), lodash_1.default.map(attributes, 'value'))
                    }]
            };
        });
        // CommerceAPI implementation
        const getProduct = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                return lodash_1.default.first(yield getProducts({ productIds: args.id }));
            });
        };
        const getProducts = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = args.productIds ? `/api-product/v1/product/search?size=${args.productIds.split(',').length}&page=1&query=${args.productIds}` : `/api-product/v1/product/search?size=12&page=1&query=${args.keyword}`;
                let products = lodash_1.default.get(yield fetch(url), 'products');
                return yield Promise.all(products.map(mapProduct));
            });
        };
        const getCategory = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                let category = (0, common_1.findInMegaMenu)(yield getMegaMenu(args), args.slug);
                return Object.assign(Object.assign({}, category), { products: yield getProductsForCategory(category) });
            });
        };
        const getMegaMenu = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (megaMenu) {
                    return megaMenu;
                }
                // the 'categories[0].children' of the node returned from this URL are the top level categories
                let categories = lodash_1.default.get(yield fetch(`/api-category/v1/category?page=1&size=1&type=ALL`), 'categories[0].children');
                if (categories) {
                    return megaMenu = categories.map(mapCategory);
                }
                throw new Error('megaMenu node not found');
            });
        };
        const getCustomerGroups = function (args) {
            return __awaiter(this, void 0, void 0, function* () {
                // i think these will live here: https://sandbox.copilot.fabric.inc/api-identity/tags/get
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
exports.default = fabricCodec;
