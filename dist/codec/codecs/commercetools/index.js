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
const codec_1 = require("../../../codec");
const util_1 = require("../../../util");
const rest_client_1 = __importDefault(require("../../../common/rest-client"));
const common_1 = require("../common");
const cats = ['women', 'men', 'new', 'sale', 'accessories'];
// caching the categories in CT as recommended here: https://docs.commercetools.com/tutorials/product-modeling/categories#best-practices-categories
let categories;
const getMapper = (args) => {
    args = {
        language: args.language || 'en',
        country: args.country || 'US',
        currency: args.currency || 'USD'
    };
    const findPrice = (variant) => {
        let price = variant.prices.find(price => price.country === args.country && price.value.currencyCode === args.currency) ||
            variant.prices.find(price => price.value.currencyCode === args.currency) ||
            lodash_1.default.first(variant.prices);
        if (!price) {
            return '--';
        }
        else {
            return (0, util_1.formatMoneyString)((price.value.centAmount / Math.pow(10, price.value.fractionDigits)), args);
        }
    };
    const mapCategory = (category) => ({
        id: category.id,
        name: localize(category.name),
        slug: localize(category.slug),
        children: categories.filter(cat => { var _a; return ((_a = cat.parent) === null || _a === void 0 ? void 0 : _a.id) === category.id; }).map(mapCategory),
        products: []
    });
    const localize = (localizable) => {
        return localizable[args.language] || localizable.en;
    };
    const getAttributeValue = (attribute) => {
        if (typeof attribute.value === 'string') {
            return attribute.value;
        }
        else if (typeof attribute.value.label === 'string') {
            return attribute.value.label;
        }
        else if (attribute.value.label) {
            return localize(attribute.value.label);
        }
        else {
            return localize(attribute.value);
        }
    };
    const mapProduct = (product) => ({
        id: product.id,
        name: localize(product.name),
        slug: localize(product.slug),
        variants: lodash_1.default.isEmpty(product.variants) ? [product.masterVariant].map(mapVariant) : product.variants.map(mapVariant),
        categories: []
    });
    const mapVariant = (variant) => ({
        sku: variant.sku,
        images: variant.images,
        listPrice: findPrice(variant),
        // todo: get discounted price
        salePrice: findPrice(variant),
        attributes: lodash_1.default.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(getAttributeValue))
    });
    return {
        findPrice,
        mapCategory,
        localize,
        getAttributeValue,
        mapProduct,
        mapVariant
    };
};
const commerceToolsCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/commercetools',
    getAPI: function (config) {
        console.log(Object.keys(config).join(', '));
        if (!config.scope) {
            return null;
        }
        const rest = (0, rest_client_1.default)({
            api_url: `${config.api_url}/${config.project}`,
            auth_url: `${config.auth_url}?grant_type=client_credentials`
        }, {}, {
            auth: {
                username: config.client_id,
                password: config.client_secret
            }
        });
        const fetch = (url) => __awaiter(this, void 0, void 0, function* () { return (yield rest.get({ url })).results; });
        const getProductsForCategory = (categoryId) => __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`/product-projections/search?filter=categories.id: subtree("${categoryId}")`);
        });
        // CommerceAPI implementation
        const getProduct = (args) => __awaiter(this, void 0, void 0, function* () {
            if (args.id) {
                let product = lodash_1.default.first(yield fetch(`/product-projections/search?filter=id:"${args.id}"`));
                return getMapper(args).mapProduct(product);
            }
            throw new Error(`getProduct(): id must be specified`);
        });
        const getProducts = (args) => __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                let queryIds = args.productIds.split(',').map(id => `"${id}"`).join(',');
                products = yield fetch(`/product-projections/search?filter=id:${queryIds}`);
            }
            else if (args.keyword) {
                products = yield fetch(`/product-projections/search?text.en="${args.keyword}"`);
            }
            return products.map(getMapper(args).mapProduct);
        });
        const getCategory = (args) => __awaiter(this, void 0, void 0, function* () {
            let category = (0, common_1.findInMegaMenu)(yield getMegaMenu(args), args.slug);
            // hydrate products into the category
            return Object.assign(Object.assign({}, category), { products: (yield getProductsForCategory(category.id)).map(getMapper(args).mapProduct) });
        });
        const getMegaMenu = (args) => __awaiter(this, void 0, void 0, function* () {
            // for the megaMenu, only get categories that have their slugs in 'cats'
            if (!categories) {
                categories = yield fetch(`/categories?limit=500`);
            }
            return categories.filter(cat => cats.includes(cat.slug.en)).map(getMapper(args).mapCategory);
        });
        const getCustomerGroups = () => __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`/customer-groups`);
        });
        // end CommerceAPI
        return {
            getProduct,
            getProducts,
            getMegaMenu,
            getCategory,
            getCustomerGroups
        };
    }
};
exports.default = commerceToolsCodec;
(0, codec_1.registerCodec)(commerceToolsCodec);
