"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMPRSAConfiguration = exports.QueryContext = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.ListArgs = exports.CommonArgs = exports.SearchResult = exports.Category = exports.Variant = exports.Attribute = exports.Product = exports.CommerceObject = exports.Keyed = exports.Identifiable = exports.CategoryResults = exports.ProductResults = exports.ResultsMeta = exports.ProductImage = exports.Prices = void 0;
class Prices {
}
exports.Prices = Prices;
class ProductImage {
}
exports.ProductImage = ProductImage;
class ResultsMeta {
}
exports.ResultsMeta = ResultsMeta;
class ProductResults {
}
exports.ProductResults = ProductResults;
class CategoryResults {
}
exports.CategoryResults = CategoryResults;
class Identifiable {
}
exports.Identifiable = Identifiable;
class Keyed extends Identifiable {
}
exports.Keyed = Keyed;
class CommerceObject extends Keyed {
}
exports.CommerceObject = CommerceObject;
class Product extends CommerceObject {
}
exports.Product = Product;
class Attribute {
}
exports.Attribute = Attribute;
class Variant extends Keyed {
}
exports.Variant = Variant;
class Category extends CommerceObject {
}
exports.Category = Category;
class SearchResult {
}
exports.SearchResult = SearchResult;
class CommonArgs {
}
exports.CommonArgs = CommonArgs;
class ListArgs extends CommonArgs {
}
exports.ListArgs = ListArgs;
class GetCategoryArgs extends CommonArgs {
}
exports.GetCategoryArgs = GetCategoryArgs;
class GetCategoryProductArgs extends CommonArgs {
}
exports.GetCategoryProductArgs = GetCategoryProductArgs;
class GetProductsArgs extends ListArgs {
}
exports.GetProductsArgs = GetProductsArgs;
class GetProductArgs extends CommonArgs {
}
exports.GetProductArgs = GetProductArgs;
class GetAttributeArgs {
}
exports.GetAttributeArgs = GetAttributeArgs;
class QueryContext {
    constructor(obj) {
        this.locale = 'en-US';
        this.language = 'en';
        this.country = 'US';
        this.currency = 'USD';
        this.segment = '';
        this.appUrl = '';
        this.method = 'get';
        this.args = (obj === null || obj === void 0 ? void 0 : obj.args) || {};
        this.locale = (obj === null || obj === void 0 ? void 0 : obj.locale) || 'en-US';
        this.language = (obj === null || obj === void 0 ? void 0 : obj.language) || 'en';
        this.country = (obj === null || obj === void 0 ? void 0 : obj.country) || 'US';
        this.currency = (obj === null || obj === void 0 ? void 0 : obj.currency) || 'USD';
        this.segment = (obj === null || obj === void 0 ? void 0 : obj.segment) || '';
        this.appUrl = (obj === null || obj === void 0 ? void 0 : obj.appUrl) || '';
    }
    getLocale() {
        return this.locale || `${this.language}-${this.country}`;
    }
}
exports.QueryContext = QueryContext;
class AMPRSAConfiguration {
}
exports.AMPRSAConfiguration = AMPRSAConfiguration;
exports.default = { QueryContext };
