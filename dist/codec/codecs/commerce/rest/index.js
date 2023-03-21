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
exports.RestCommerceCodec = exports.RestCommerceCodecType = void 0;
const lodash_1 = __importDefault(require("lodash"));
const core_1 = require("../../core");
const cms_property_types_1 = require("../../../cms-property-types");
const axios_1 = __importDefault(require("axios"));
const codec_error_1 = require("../../codec-error");
const common_1 = require("../../common");
/**
 * Fetch JSON from a given URL.
 * @param url URL to fetch from
 * @param defaultValue Default value if URL is empty
 * @returns Response data
 */
const fetchFromURL = (url, defaultValue) => __awaiter(void 0, void 0, void 0, function* () { return lodash_1.default.isEmpty(url) ? defaultValue : yield (0, codec_error_1.catchAxiosErrors)(() => __awaiter(void 0, void 0, void 0, function* () { return (yield axios_1.default.get(url)).data; })); });
/**
 * Commerce Codec Type that integrates with REST.
 */
class RestCommerceCodecType extends core_1.CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor() {
        return 'rest';
    }
    /**
     * @inheritdoc
     */
    get properties() {
        return {
            productURL: {
                title: 'Product file URL',
                type: 'string',
                pattern: cms_property_types_1.StringPatterns.anyUrl
            },
            categoryURL: {
                title: 'Category file URL',
                type: 'string',
                pattern: cms_property_types_1.StringPatterns.anyUrl
            },
            customerGroupURL: {
                title: 'Customer group file URL',
                type: 'string',
                pattern: cms_property_types_1.StringPatterns.anyUrl
            },
            translationsURL: {
                title: 'Translations file URL',
                type: 'string',
                pattern: cms_property_types_1.StringPatterns.anyUrl
            }
        };
    }
    /**
     * @inheritdoc
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new RestCommerceCodec(config).init(this);
        });
    }
}
exports.RestCommerceCodecType = RestCommerceCodecType;
/**
 * Commerce Codec that integrates with REST.
 */
class RestCommerceCodec extends core_1.CommerceCodec {
    /**
     * @inheritdoc
     */
    cacheCategoryTree() {
        return __awaiter(this, void 0, void 0, function* () {
            this.categories = yield fetchFromURL(this.config.categoryURL, []);
            this.products = yield fetchFromURL(this.config.productURL, []);
            this.customerGroups = yield fetchFromURL(this.config.customerGroupURL, []);
            this.translations = yield fetchFromURL(this.config.translationsURL, {});
            this.categoryTree = this.categories.filter(cat => !cat.parent);
        });
    }
    /**
     * @inheritdoc
     */
    getProducts(args, raw = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureCategoryTree();
            if (args.productIds) {
                const ids = args.productIds.split(',');
                return (0, common_1.mapIdentifiers)(ids, this.products.filter(prod => ids.includes(prod.id)));
            }
            else if (args.keyword) {
                return this.products.filter(prod => prod.name.toLowerCase().indexOf(args.keyword.toLowerCase()) > -1);
            }
            else if (args.category) {
                return [
                    ...lodash_1.default.filter(this.products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), args.category.id))
                ];
            }
            throw (0, common_1.getProductsArgError)(raw ? 'getProductsRaw' : 'getProducts');
        });
    }
    /**
     * @inheritdoc
     */
    getRawProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProducts(args, true);
        });
    }
    /**
     * @inheritdoc
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureCategoryTree();
            return this.customerGroups;
        });
    }
}
exports.RestCommerceCodec = RestCommerceCodec;
exports.default = RestCommerceCodecType;
// registerCodec(new RestCommerceCodecType())
