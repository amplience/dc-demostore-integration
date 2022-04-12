"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoStoreConfiguration = exports.qc = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.Category = exports.Variant = exports.Product = exports.CommerceObject = exports.CustomerGroup = exports.Identifiable = exports.Image = void 0;
class Image {
}
exports.Image = Image;
class Identifiable {
}
exports.Identifiable = Identifiable;
class CustomerGroup extends Identifiable {
}
exports.CustomerGroup = CustomerGroup;
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
