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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCommerceCodec = exports.TemplateCommerceCodecType = void 0;
const __1 = require("../..");
/**
 * TODO
 */
class TemplateCommerceCodecType extends __1.CommerceCodecType {
    /**
     * TODO
     */
    get vendor() {
        return 'template';
    }
    /**
     * TODO
     */
    get properties() {
        return {
        // productURL: {
        //     title: "Product file URL",
        //     type: "string"
        // }
        };
    }
    /**
     * TODO
     * @param config
     * @returns
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new TemplateCommerceCodec(config).init(this);
        });
    }
}
exports.TemplateCommerceCodecType = TemplateCommerceCodecType;
/**
 * TODO
 */
class TemplateCommerceCodec extends __1.CommerceCodec {
    // instance variables
    // products: Product[]
    // categories: Category[]
    /**
     * TODO
     * @param codecType
     * @returns
     */
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // this.products = await fetchFromURL(this.config.productURL, [])
            // this.megaMenu = this.categories.filter(cat => !cat.parent)
            return yield _super.init.call(this, codecType);
        });
    }
    /**
     * TODO
     * @param args
     */
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-empty
            if (args.productIds) {
            }
            // eslint-disable-next-line no-empty
            else if (args.keyword) {
            }
            // eslint-disable-next-line no-empty
            else if (args.category) {
            }
            throw new Error('getProducts() requires either: productIds, keyword, or category reference');
        });
    }
    /**
     * TODO
     * @param args
     */
    getRawProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-empty
            if (args.productIds) {
            }
            // eslint-disable-next-line no-empty
            else if (args.keyword) {
            }
            // eslint-disable-next-line no-empty
            else if (args.category) {
            }
            throw new Error('getProducts() requires either: productIds, keyword, or category reference');
        });
    }
    /**
     * TODO
     * @param args
     * @returns
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.TemplateCommerceCodec = TemplateCommerceCodec;
exports.default = TemplateCommerceCodecType;
// registerCodec(new TemplateCommerceCodecType())
