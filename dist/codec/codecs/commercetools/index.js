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
exports.CommercetoolsCodec = exports.CommercetoolsCodecType = void 0;
const common_1 = require("../../../common");
const lodash_1 = __importDefault(require("lodash"));
const core_1 = require("../core");
const util_1 = require("../../../common/util");
const pagination_1 = require("../pagination");
const cats = ['women', 'men', 'new', 'sale', 'accessories'];
/**
 * Commerce Codec Type that integrates with Commercetools.
 */
class CommercetoolsCodecType extends core_1.CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor() {
        return 'commercetools';
    }
    /**
     * @inheritdoc
     */
    get properties() {
        return Object.assign(Object.assign({}, common_1.ClientCredentialProperties), { project: {
                title: 'project key',
                type: 'string',
                minLength: 1
            }, scope: {
                title: 'scope',
                type: 'string',
                maxLength: 1000
            } });
    }
    /**
     * @inheritdoc
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new CommercetoolsCodec(config).init(this);
        });
    }
}
exports.CommercetoolsCodecType = CommercetoolsCodecType;
/**
 * Convert a localized string using the locale in args.
 * @param localizable Localizable string object
 * @param args Method arguments that contain the language
 */
const localize = (localizable, args) => {
    return localizable[args.language] || localizable.en;
};
/**
 * Generates a method to get an attribute's value using the method arguments.
 * @param args Method arguments
 * @returns Method to get an attribute's value
 */
const getAttributeValue = (args) => (attribute) => {
    if (typeof attribute.value === 'string') {
        return attribute.value;
    }
    else if (typeof attribute.value.label === 'string') {
        return attribute.value.label;
    }
    else if (attribute.value.label) {
        return localize(attribute.value.label, args);
    }
    else {
        return localize(attribute.value, args);
    }
};
/**
 * Find the local price of a variant from the method arguments.
 * @param variant Commercetools variant
 * @param args Method arguments
 * @returns The price of a variant
 */
const findPrice = (variant, args) => {
    const price = variant.prices &&
        (variant.prices.find(price => price.country === args.country && price.value.currencyCode === args.currency) ||
            variant.prices.find(price => price.value.currencyCode === args.currency) ||
            lodash_1.default.first(variant.prices));
    if (!price) {
        return '--';
    }
    else {
        return (0, util_1.formatMoneyString)((price.value.centAmount / Math.pow(10, price.value.fractionDigits)), args);
    }
};
/**
 * Map a Commercetools category to a common category.
 * @param category Commercetools category
 * @param categories All Commercetools categories
 * @param args Method arguments
 * @returns Category
 */
const mapCategory = (category, categories, args) => {
    return {
        id: category.id,
        name: localize(category.name, args),
        slug: localize(category.slug, args),
        children: categories.filter(cat => { var _a; return ((_a = cat.parent) === null || _a === void 0 ? void 0 : _a.id) === category.id; }).map(cat => mapCategory(cat, categories, args)),
        products: []
    };
};
/**
 * Generates a method to map a Commercetools product to the common product type.
 * @param args Commercetools product
 * @returns Method to map a Commercetools product to a common one
 */
const mapProduct = (args) => (product) => {
    return {
        id: product.id,
        name: localize(product.name, args),
        slug: localize(product.slug, args),
        variants: lodash_1.default.isEmpty(product.variants) ? [product.masterVariant].map(mapVariant(args)) : product.variants.map(mapVariant(args)),
        categories: []
    };
};
/**
 * Generates a method to map a Commercetools variant to the common variant type.
 * @param args Commercetools variant
 * @returns Method to map a Commercetools variant to a common one
 */
const mapVariant = (args) => (variant) => {
    return {
        sku: variant.sku,
        images: variant.images,
        listPrice: findPrice(variant, args),
        // todo: get discounted price
        salePrice: findPrice(variant, args),
        attributes: lodash_1.default.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(getAttributeValue(args)))
    };
};
/**
 * Commerce Codec that integrates with Commercetools.
 */
class CommercetoolsCodec extends core_1.CommerceCodec {
    constructor() {
        super(...arguments);
        this.getPage = (0, pagination_1.getPageByQuery)('offset', 'limit', 'total', 'results');
    }
    /**
     * @inheritdoc
     */
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.rest = (0, common_1.OAuthRestClient)({
                api_url: `${this.config.api_url}/${this.config.project}`,
                auth_url: `${this.config.auth_url}?grant_type=client_credentials`
            }, {}, {
                auth: {
                    username: this.config.client_id,
                    password: this.config.client_secret
                }
            });
            return yield _super.init.call(this, codecType);
        });
    }
    /**
     * @inheritdoc
     */
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield (0, pagination_1.paginate)(this.getPage(this.rest, '/categories'), 500);
            const mapped = categories.map(cat => mapCategory(cat, categories, {}));
            this.megaMenu = mapped.filter(cat => cats.includes(cat.slug));
        });
    }
    /**
     * Fetches data from the OAuth authenticated client.
     * @param url URL to fetch data from
     * @returns Response data
     */
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.rest.get({ url })).results;
        });
    }
    /**
     * @inheritdoc
     */
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield (0, pagination_1.paginate)(this.getPage(this.rest, `/product-projections/search?filter=id:${(0, util_1.quoteProductIdString)(args.productIds)}`));
            }
            else if (args.keyword) {
                products = yield (0, pagination_1.paginate)(this.getPage(this.rest, `/product-projections/search?text.en="${args.keyword}"`));
            }
            else if (args.category) {
                products = yield (0, pagination_1.paginate)(this.getPage(this.rest, `/product-projections/search?filter=categories.id: subtree("${args.category.id}")`));
            }
            return products.map(mapProduct(args));
        });
    }
    /**
     * @inheritdoc
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, pagination_1.paginate)(this.getPage(this.rest, '/customer-groups'));
        });
    }
}
exports.CommercetoolsCodec = CommercetoolsCodec;
exports.default = CommercetoolsCodecType;
// registerCodec(new CommercetoolsCodecType())
