"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoStoreConfiguration = exports.GetAttributeArgs = exports.Promotion = exports.Category = exports.Variant = exports.Product = exports.CommerceObject = exports.CustomerGroup = exports.Identifiable = exports.Image = void 0;
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
class Promotion extends Identifiable {
}
exports.Promotion = Promotion;
class GetAttributeArgs {
}
exports.GetAttributeArgs = GetAttributeArgs;
class DemoStoreConfiguration {
}
exports.DemoStoreConfiguration = DemoStoreConfiguration;
