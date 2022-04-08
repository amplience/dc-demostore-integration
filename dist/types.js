"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoStoreConfiguration = exports.qc = exports.QueryContext = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.Category = exports.Variant = exports.Product = exports.CommerceObject = exports.Identifiable = exports.ProductImage = void 0;
class ProductImage {
}
exports.ProductImage = ProductImage;
class Identifiable {
}
exports.Identifiable = Identifiable;
class CommerceObject extends Identifiable {
}
exports.CommerceObject = CommerceObject;
class Product extends CommerceObject {
}
exports.Product = Product;
class Variant {
}
exports.Variant = Variant;
class Category extends CommerceObject {
}
exports.Category = Category;
class GetCategoryArgs {
}
exports.GetCategoryArgs = GetCategoryArgs;
class GetCategoryProductArgs {
}
exports.GetCategoryProductArgs = GetCategoryProductArgs;
class GetProductsArgs {
}
exports.GetProductsArgs = GetProductsArgs;
class GetProductArgs {
}
exports.GetProductArgs = GetProductArgs;
class GetAttributeArgs {
}
exports.GetAttributeArgs = GetAttributeArgs;
class QueryContext {
    constructor() {
        this.locale = 'en-US';
        this.language = 'en';
        this.country = 'US';
        this.currency = 'USD';
        this.segment = '';
        this.appUrl = '';
        this.method = 'get';
    }
}
exports.QueryContext = QueryContext;
const qc = (args, locale = 'en-US', language = 'en', country = 'US', currency = 'USD', segment = '', appUrl = '', method = 'get') => ({
    args,
    locale,
    language,
    country,
    currency,
    segment,
    appUrl,
    method
});
exports.qc = qc;
class DemoStoreConfiguration {
}
exports.DemoStoreConfiguration = DemoStoreConfiguration;
exports.default = { QueryContext };
