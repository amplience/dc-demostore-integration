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
const urijs_1 = __importDefault(require("urijs"));
const axios_1 = __importDefault(require("axios"));
const currency_js_1 = __importDefault(require("currency.js"));
const operation_1 = require("./operation");
const types_1 = require("../../../types");
const codec_1 = require("../../../codec");
const util_1 = require("../../../util");
const getAttributeValue = (attributes = [], name) => {
    return lodash_1.default.get(lodash_1.default.find(attributes, att => att.name === name), 'value');
};
class CommerceToolsCodec extends codec_1.Codec {
    constructor(config) {
        super(config);
        this.productOperation = new CommerceToolsProductOperation(config);
        this.categoryOperation = new CommerceToolsCategoryOperation(config);
    }
    getMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getCategoryHierarchy(new types_1.QueryContext({ args: { categorySlugs: ['women', 'men', 'accessories', 'sale', 'new'] } }));
        });
    }
    getProduct(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productOperation.get(query);
        });
    }
    getProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productOperation.get(query);
        });
    }
    getCategoryHierarchy(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = query.args.id && ((c) => c.id === query.args.id) ||
                query.args.slug && ((c) => c.slug === query.args.slug) ||
                query.args.key && ((c) => c.key === query.args.key) ||
                query.args.categorySlugs && ((c) => lodash_1.default.includes(query.args.categorySlugs, c.slug)) ||
                ((c) => { var _a; return !((_a = c.parent) === null || _a === void 0 ? void 0 : _a.id); });
            let categories = lodash_1.default.get(yield this.categoryOperation.get(new types_1.QueryContext(Object.assign(Object.assign({}, query), { args: {} }))), 'results');
            let populateChildren = (category) => {
                category.children = lodash_1.default.filter(categories, (c) => c.parent && c.parent.id === category.id);
                lodash_1.default.each(category.children, populateChildren);
                return category;
            };
            let x = lodash_1.default.map(lodash_1.default.filter(categories, filter), populateChildren);
            return x;
        });
    }
    getCategories(query) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`[ aria ] CommerceToolsCodec.getCategories() not yet implemented`);
            // return await this.getCategoryHierarchy(query)
        });
    }
    getCategory(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let x = lodash_1.default.find(yield this.getCategoryHierarchy(query), (c) => c.id === query.args.id || c.slug === query.args.slug || c.key === query.args.key);
            if (x) {
                x.products = yield this.getProductsForCategory(x, query);
            }
            return x;
        });
    }
    getProductsForCategory(parent, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.productOperation.get(new types_1.QueryContext(Object.assign(Object.assign({}, query), { args: { filter: `categories.id: subtree("${parent.id}")` } })))).results;
        });
    }
}
const mapImage = (image) => image && ({ url: image.url });
class CommerceToolsOperation extends operation_1.Operation {
    getBaseURL() {
        return `${this.config.api_url}/${this.config.project}/`;
    }
    getURL(context) {
        return `${this.getBaseURL()}${this.getRequestPath(context)}`;
    }
    getRequest(context) {
        let uri = new urijs_1.default(this.getURL(context));
        let query = Object.assign({ limit: context.args.limit, offset: context.args.offset, where: context.args.where, filter: context.args.filter }, context.args);
        // add any filters based on the args
        uri.addQuery(query);
        return uri.toString();
    }
    localize(text, context) {
        if (!text) {
            console.error(new Error().stack);
        }
        if (text.label) {
            text = text.label;
        }
        if (typeof text === 'string') {
            return text;
        }
        if (typeof text === 'boolean') {
            let b = text;
            return b;
        }
        let localized = text[context.language] || text['en'] || text[Object.keys(text)[0]];
        // if (_.isEmpty(localized)) {
        //     console.log(`localize: ${JSON.stringify(text)}`)
        // }
        return localized;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.accessToken) {
                let response = yield axios_1.default.post(`${this.config.auth_url}/oauth/token?grant_type=client_credentials&scope=${lodash_1.default.first(lodash_1.default.split(this.config.scope, ' '))}`, {}, {
                    auth: {
                        username: this.config.client_id,
                        password: this.config.client_secret
                    }
                });
                this.accessToken = `${response.data.token_type} ${response.data.access_token}`;
            }
            return this.accessToken;
        });
    }
    translateResponse(data, mapper = ((x) => x)) {
        return __awaiter(this, void 0, void 0, function* () {
            // a commercetools response will be either a single object, or an array in 'results'
            // if it is an array, limit, count, total, and offset are provided on the object
            let r = data.results || [data];
            return {
                meta: data.limit && {
                    limit: data.limit,
                    count: data.count,
                    offset: data.offset,
                    total: data.total
                },
                results: yield Promise.all(r.map(yield mapper))
            };
        });
    }
    getHeaders() {
        return __awaiter(this, void 0, void 0, function* () {
            return { authorization: yield this.authenticate() };
        });
    }
}
// category operation
class CommerceToolsCategoryOperation extends CommerceToolsOperation {
    export(context) {
        let self = this;
        return function (category) {
            return {
                id: category.id,
                parent: category.parent || {},
                ancestors: category.ancestors,
                name: self.localize(category.name, context),
                slug: self.localize(category.slug, context),
                key: category.slug.en
            };
        };
    }
    getRequestPath(context) {
        return context.args.key ? `categories/key=${context.args.key}` : `categories`;
    }
    get(context) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.get.call(this, new types_1.QueryContext(Object.assign(Object.assign({}, context), { args: Object.assign(Object.assign({}, context.args), { limit: 500, where: context.args.slug && [`slug(${context.language || 'en'}="${context.args.slug}") or slug(en="${context.args.slug}")`] ||
                        context.args.id && [`id="${context.args.id}"`] }) })));
        });
    }
}
// end category operations
// cart discount operation
class CommerceToolsCartDiscountOperation extends CommerceToolsOperation {
    getRequestPath(context) {
        return `cart-discounts`;
    }
}
// end cart discount operations
// product operation
class CommerceToolsProductOperation extends CommerceToolsOperation {
    getRequestPath(context) {
        if (context.args.keyword || context.args.filter) {
            return `product-projections/search`;
        }
        else {
            return context.args.key ? `product-projections/key=${context.args.key}` : `product-projections`;
        }
    }
    get(context) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (context.args.all) {
                let getCategories = (limit, offset) => __awaiter(this, void 0, void 0, function* () {
                    return yield _super.get.call(this, Object.assign(Object.assign({}, context.args), { limit,
                        offset, expand: ['categories[*]'] }));
                });
                let results = [];
                let total = -1;
                while (total === -1 || results.length < total) {
                    let response = yield getCategories(100, results.length);
                    results = results.concat(response.results);
                    total = response.meta.total;
                    console.log(`[ ct ] retrieved products: ${results.length}/${total}`);
                }
                return {
                    meta: {
                        total: results.length,
                        count: results.length
                    },
                    results
                };
            }
            else {
                return yield _super.get.call(this, new types_1.QueryContext(Object.assign(Object.assign({}, context), { args: {
                        expand: ['categories[*]'],
                        priceCountry: context.country,
                        priceCurrency: context.currency,
                        [`text.${context.language}`]: context.args.keyword,
                        filter: context.args.filter ||
                            context.args.productIds && [`id:${lodash_1.default.map(context.args.productIds.split(','), (x) => `"${x}"`).join(',')}`],
                        where: context.args.id && [`id="${context.args.id}"`] ||
                            context.args.slug && [`slug(${context.language}="${context.args.slug}") or slug(en="${context.args.slug}")`] ||
                            context.args.sku && [`variants(sku="${context.args.sku}")`]
                    } })));
            }
        });
    }
    post(context) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            context.args = Object.assign(Object.assign({}, context.args), { body: this.import(context.args.product) });
            return yield _super.post.call(this, context);
        });
    }
    export(context) {
        let self = this;
        return function (product) {
            var _a;
            return {
                id: product.id,
                name: self.localize(product.name, context),
                slug: self.localize(product.slug, context),
                // longDescription: product.metaDescription && self.localize(product.metaDescription, context),
                imageSetId: getAttributeValue((_a = product.variants[0]) === null || _a === void 0 ? void 0 : _a.attributes, 'articleNumberMax'),
                variants: lodash_1.default.map(lodash_1.default.concat(product.variants, [product.masterVariant]), (variant) => {
                    return {
                        sku: variant.sku || product.key,
                        prices: {
                            list: (0, util_1.formatMoneyString)(lodash_1.default.get(variant.scopedPrice || lodash_1.default.first(variant.prices), 'value.centAmount') / 100, context),
                            sale: (0, util_1.formatMoneyString)(lodash_1.default.get(variant.scopedPrice || lodash_1.default.first(variant.prices), 'value.centAmount') / 100, context)
                        },
                        images: lodash_1.default.map(variant.images, mapImage),
                        attributes: lodash_1.default.map(variant.attributes, (att) => ({ name: att.name, value: self.localize(att.value, context) }))
                    };
                }),
                categories: lodash_1.default.map(product.categories, function (cat) {
                    let category = cat.obj || cat;
                    return {
                        id: category.id,
                        parent: category.parent,
                        ancestors: category.ancestors
                    };
                }),
                productType: product.productType.id,
                key: product.slug.en
            };
        };
    }
    postProcessor(context) {
        let self = this;
        return function (products) {
            return __awaiter(this, void 0, void 0, function* () {
                let segment = context.segment;
                if (!lodash_1.default.isEmpty(segment) && segment !== 'null' && segment !== 'undefined') {
                    let discountOperation = new CommerceToolsCartDiscountOperation(self.config);
                    let cartDiscounts = (yield discountOperation.get(new types_1.QueryContext())).results;
                    let applicableDiscounts = lodash_1.default.filter(cartDiscounts, (cd) => cd.cartPredicate === `customer.customerGroup.key = "${segment.toUpperCase()}"`);
                    return lodash_1.default.map(products, (product) => {
                        return Object.assign(Object.assign({}, product), { variants: lodash_1.default.map(product.variants, (variant) => {
                                let sale = (0, currency_js_1.default)(variant.prices.list).value;
                                lodash_1.default.each(applicableDiscounts, (discount) => {
                                    if (discount.target.type === 'lineItems') {
                                        let [predicateKey, predicateValue] = discount.target.predicate.split(" = ");
                                        if (discount.target.predicate === '1 = 1' || (predicateKey === 'productType.id' && `"${product.productType}"` === predicateValue)) {
                                            if (discount.value.type === 'relative') {
                                                // permyriad is pct off * 10000
                                                sale = sale * (1 - discount.value.permyriad / 10000);
                                            }
                                        }
                                    }
                                });
                                variant.prices.sale = (0, currency_js_1.default)(sale).format();
                                return variant;
                            }) });
                    });
                }
                else {
                    return products;
                }
            });
        };
    }
}
exports.default = {
    // codec generator conformance
    SchemaURI: 'https://demostore.amplience.com/site/integration/commercetools',
    getInstance: (config) => __awaiter(void 0, void 0, void 0, function* () {
        return new CommerceToolsCodec(config);
    })
    // end codec generator conformance
};
