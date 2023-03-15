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
exports.ShopifyCommerceCodec = exports.ShopifyCommerceCodecType = void 0;
const core_1 = require("../../core");
const common_1 = require("../../common");
const axios_1 = __importDefault(require("axios"));
const codec_error_1 = require("../../codec-error");
const util_1 = require("../../../../common/util");
const productShared = `
id
title
description
collections(first: 100) {
  edges {
	node {
	  id
	  handle
	  title
	}
	cursor
  }
}
tags
variants(first: 100) {
  edges {
	node {
	  id
	  title
	  sku
	  selectedOptions {
		name
		value
	  }
	  price {
		currencyCode
		amount
	  }
	  unitPrice {
		currencyCode
		amount
	  },
	  compareAtPrice {
		currencyCode
		amount
	  }
	  image {
		id
		url
		altText
	  }
	}
	cursor
  }
}
images(first: 100) {
  edges {
	node {
	  id
	  url
	  altText
	}
	cursor
  }
}
availableForSale
handle`;
const productsByQuery = `
query getProducts($pageSize: Int!, $query: String, $after: String){
  products(first: $pageSize, after: $after, query: $query) {
    edges {
      node {
${productShared}
      }
      cursor
    }
  }
}`;
const productById = `
query getProductById($id: ID!) {
	product(id: $id) {
${productShared}
	}
}`;
const productsByCategory = `
query getProductsByCategory($handle: String!, $pageSize: Int!, $after: String) {
  collection(handle: $handle) {
    products(first: $pageSize, after: $after) {
      edges {
        node {
${productShared}
        }
        cursor
      }
    }
  }
}`;
/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
class ShopifyCommerceCodecType extends core_1.CommerceCodecType {
    /**
     * @inheritdoc
     */
    get vendor() {
        return 'shopify';
    }
    /**
     * @inheritdoc
     */
    get properties() {
        return {
            access_token: {
                title: 'access token',
                type: 'string',
                minLength: 1
            },
            version: {
                title: 'version',
                type: 'string',
                minLength: 1
            },
            site_id: {
                title: 'site id',
                type: 'string',
                minLength: 1
            }
        };
    }
    /**
     * @inheritdoc
     */
    getApi(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new ShopifyCommerceCodec(config).init(this);
        });
    }
}
exports.ShopifyCommerceCodecType = ShopifyCommerceCodecType;
/**
 * A template commerce codec, useful as a starting point for a new integration.
 */
class ShopifyCommerceCodec extends core_1.CommerceCodec {
    // instance variables
    // products: Product[]
    // categories: Category[]
    /**
     * @inheritdoc
     */
    init(codecType) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.apiClient = axios_1.default.create({
                baseURL: `https://${this.config.site_id}.myshopify.com/api/${this.config.version}`,
                headers: {
                    'X-Shopify-Storefront-Access-Token': this.config.access_token
                }
            });
            // this.products = await fetchFromURL(this.config.productURL, [])
            // this.megaMenu = this.categories.filter(cat => !cat.parent)
            return yield _super.init.call(this, codecType);
        });
    }
    gqlRequest(query, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'graphql.json';
            const result = yield (0, common_1.logResponse)('get', url, (yield (0, codec_error_1.catchAxiosErrors)(() => __awaiter(this, void 0, void 0, function* () {
                return yield this.apiClient.post(url, {
                    query,
                    variables
                });
            }))).data);
            return result.data;
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.gqlRequest(productById, { id })).product;
        });
    }
    getProductsByKeyword(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: pagination
            const query = keyword;
            const pageSize = 100;
            const result = yield this.gqlRequest(productsByQuery, { query, pageSize });
            return result.products.edges.map(edge => edge.node);
        });
    }
    getProductsByCategory(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: pagination
            const query = keyword;
            const pageSize = 100;
            const result = yield this.gqlRequest(productsByCategory, { query, pageSize });
            return result.category.products.edges.map(edge => edge.node);
        });
    }
    firstNonEmpty(strings) {
        return strings.find(string => string !== '' && string != null);
    }
    mapPrice(price) {
        return (0, util_1.formatMoneyString)(price.amount, { currency: price.currencyCode });
    }
    mapCategoryMinimal(collection) {
        return {
            id: collection.id,
            slug: collection.handle,
            name: collection.title,
            children: [],
            products: []
        };
    }
    mapVariant(variant, sharedImages) {
        var _a, _b, _c;
        const attributes = {};
        for (const option of variant.selectedOptions) {
            attributes[option.name] = option.value;
        }
        return {
            sku: this.firstNonEmpty([variant.sku, variant.id]),
            listPrice: this.mapPrice((_a = variant.price) !== null && _a !== void 0 ? _a : variant.unitPrice),
            salePrice: this.mapPrice((_c = (_b = variant.compareAtPrice) !== null && _b !== void 0 ? _b : variant.price) !== null && _c !== void 0 ? _c : variant.unitPrice),
            attributes: attributes,
            images: [variant.image, ...sharedImages]
        };
    }
    mapProduct(product) {
        const sharedImages = product.images.edges.filter(image => product.variants.edges.findIndex(variant => variant.node.image.id === image.node.id) === -1).map(edge => edge.node);
        return {
            id: product.id,
            name: product.title,
            slug: product.handle,
            categories: product.collections.edges.map(collection => this.mapCategoryMinimal(collection.node)),
            variants: product.variants.edges.map(variant => this.mapVariant(variant.node, sharedImages)),
            shortDescription: product.description,
            longDescription: product.description
        };
    }
    /**
     * @inheritdoc
     */
    getProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getRawProducts(args)).map(product => this.mapProduct(product));
        });
    }
    /**
     * @inheritdoc
     */
    getRawProducts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            // eslint-disable-next-line no-empty
            if (args.productIds) {
                products = yield Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)));
            }
            // eslint-disable-next-line no-empty
            else if (args.keyword) {
                products = yield this.getProductsByKeyword(args.keyword);
            }
            // eslint-disable-next-line no-empty
            else if (args.category) {
                products = yield this.getProductsByCategory(args.category.slug);
            }
            else {
                throw (0, common_1.getProductsArgError)('getRawProducts');
            }
            return products;
        });
    }
    /**
     * @inheritdoc
     */
    getCustomerGroups(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.ShopifyCommerceCodec = ShopifyCommerceCodec;
exports.default = ShopifyCommerceCodecType;
// registerCodec(new ShopifyCommerceCodecType())
