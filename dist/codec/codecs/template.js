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
class TemplateCommerceCodecType extends __1.CommerceCodecType {
    get vendor() {
        return 'template';
    }
    get properties() {
        return {
        // productURL: {
        //     title: "Product file URL",
        //     type: "string"
        // }
        };
    }
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new TemplateCommerceCodec(config).init(this);
        });
    }
}
exports.TemplateCommerceCodecType = TemplateCommerceCodecType;
class TemplateCommerceCodec extends __1.CommerceCodec {
    // instance variables
    // products: Product[]
    // categories: Category[]
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
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.productIds) {
            }
            else if (args.keyword) {
            }
            else if (args.category) {
            }
            throw new Error(`getProducts() requires either: productIds, keyword, or category reference`);
        });
    }
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.TemplateCommerceCodec = TemplateCommerceCodec;
exports.default = TemplateCommerceCodecType;
(0, __1.registerCodec)(new TemplateCommerceCodecType());
