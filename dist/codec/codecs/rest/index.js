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
const __1 = require("../../");
const cms_property_types_1 = require("../../cms-property-types");
/**
 * TODO
 * @param url
 * @param defaultValue
 * @returns
 */
const fetchFromURL = (url, defaultValue) => __awaiter(void 0, void 0, void 0, function* () { return lodash_1.default.isEmpty(url) ? defaultValue : yield (yield fetch(url)).json(); });
class RestCommerceCodecType extends __1.CommerceCodecType {
    /**
     * TODO
     */
    get vendor() {
        return 'rest';
    }
    /**
     * TODO
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
     * TODO
     * @param config
     * @returns
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new RestCommerceCodec(config).init(this);
        });
    }
}
exports.RestCommerceCodecType = RestCommerceCodecType;
/**
 * TODO
 */
class RestCommerceCodec extends __1.CommerceCodec {
    /**
     * TODO
     */
    cacheMegaMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            this.categories = yield fetchFromURL(this.config.categoryURL, []);
            this.products = yield fetchFromURL(this.config.productURL, []);
            this.customerGroups = yield fetchFromURL(this.config.customerGroupURL, []);
            this.translations = yield fetchFromURL(this.config.translationsURL, {});
            this.megaMenu = this.categories.filter(cat => !cat.parent);
        });
    }
    /**
     * TODO
     * @param args
     * @returns
     */
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.productIds) {
                return this.products.filter(prod => args.productIds.split(',').includes(prod.id));
            }
            else if (args.keyword) {
                return this.products.filter(prod => prod.name.toLowerCase().indexOf(args.keyword.toLowerCase()) > -1);
            }
            else if (args.category) {
                return [
                    ...lodash_1.default.filter(this.products, prod => lodash_1.default.includes(lodash_1.default.map(prod.categories, 'id'), args.category.id))
                ];
            }
            throw new Error('getProducts() requires either: productIds, keyword, or category reference');
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.customerGroups;
        });
    }
}
exports.RestCommerceCodec = RestCommerceCodec;
exports.default = RestCommerceCodecType;
// registerCodec(new RestCommerceCodecType())
