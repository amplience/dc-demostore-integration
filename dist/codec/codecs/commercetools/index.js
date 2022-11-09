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
const __1 = require("../../");
const util_1 = require("../../../common/util");
const cats = ['women', 'men', 'new', 'sale', 'accessories'];
class CommercetoolsCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'commercetools';
    }
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
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new CommercetoolsCodec(config).init(this);
        });
    }
}
exports.CommercetoolsCodecType = CommercetoolsCodecType;
const localize = (localizable, args) => {
    return localizable[args.language] || localizable.en;
};
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
const mapCategory = (category, categories, args) => {
    return {
        id: category.id,
        name: localize(category.name, args),
        slug: localize(category.slug, args),
        children: categories.filter(cat => { var _a; return ((_a = cat.parent) === null || _a === void 0 ? void 0 : _a.id) === category.id; }).map(cat => mapCategory(cat, categories, args)),
        products: []
    };
};
const mapProduct = (args) => (product) => {
    return {
        id: product.id,
        name: localize(product.name, args),
        slug: localize(product.slug, args),
        variants: lodash_1.default.isEmpty(product.variants) ? [product.masterVariant].map(mapVariant(args)) : product.variants.map(mapVariant(args)),
        categories: []
    };
};
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
class CommercetoolsCodec extends __1.CommerceCodec {
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
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.fetch('/categories?limit=500');
            const mapped = categories.map(cat => mapCategory(cat, categories, {}));
            this.megaMenu = mapped.filter(cat => cats.includes(cat.slug));
        });
    }
    fetch(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.rest.get({ url })).results;
        });
    }
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (args.productIds) {
                products = yield this.fetch(`/product-projections/search?filter=id:${(0, util_1.quoteProductIdString)(args.productIds)}`);
            }
            else if (args.keyword) {
                products = yield this.fetch(`/product-projections/search?text.en="${args.keyword}"`);
            }
            else if (args.category) {
                products = yield this.fetch(`/product-projections/search?filter=categories.id: subtree("${args.category.id}")`);
            }
            return products.map(mapProduct(args));
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch('/customer-groups');
        });
    }
}
exports.CommercetoolsCodec = CommercetoolsCodec;
exports.default = CommercetoolsCodecType;
// registerCodec(new CommercetoolsCodecType())
