"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoStoreConfiguration = exports.qc = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.Category = exports.Variant = exports.Product = exports.CommerceObject = exports.Identifiable = exports.ProductImage = void 0;
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
const qc = (args, locale = 'en-US', language = 'en', country = 'US', currency = 'USD', segment = '', appUrl = '', method = 'get') => (Object.assign(Object.assign({}, args), { locale,
    language,
    country,
    currency,
    segment,
    appUrl,
    method }));
exports.qc = qc;
class DemoStoreConfiguration {
}
exports.DemoStoreConfiguration = DemoStoreConfiguration;
