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
const fs_extra_1 = __importDefault(require("fs-extra"));
const async_1 = __importDefault(require("async"));
const lodash_1 = __importDefault(require("lodash"));
const ConstructorIOClient = require('@constructor-io/constructorio-node');
const constructorio = new ConstructorIOClient({
    apiKey: '********',
    apiToken: '********'
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`reading item groups...`);
    let fileCategories = fs_extra_1.default.readJSONSync(`/Users/dave/work/data/commercetools/categories.json`);
    let categories = fileCategories.map(category => {
        var _a;
        return ({
            id: category.slug,
            name: category.name,
            parent_id: (_a = fileCategories.find(cat => { var _a; return cat.id === ((_a = category.parent) === null || _a === void 0 ? void 0 : _a.id); })) === null || _a === void 0 ? void 0 : _a.slug
        });
    });
    // console.log(`updating item groups...`)
    // await async.eachSeries(categories, async (category, callback) => {
    //     let itemGroup = await constructorio.catalog.getItemGroup(category.id)
    //     if (!itemGroup) {
    //         console.log(`creating item group [ ${category.id} ]...`)
    //         await constructorio.catalog.addItemGroup(category)
    //     }
    //     callback()
    // })
    console.log(`reading items...`);
    let fileProducts = fs_extra_1.default.readJSONSync(`/Users/dave/work/data/commercetools/products.json`);
    let products = fileProducts.map(product => {
        let imageSetId = product.imageSetId;
        if (imageSetId) {
            while (imageSetId.length < 6) {
                imageSetId = `0${imageSetId}`;
            }
        }
        return {
            item_name: product.name,
            section: 'Products',
            url: `https://machathon2022-demostore.vercel.app/product/${product.id}/${product.slug}`,
            image_url: imageSetId && `https://cdn.media.amplience.net/s/willow/${imageSetId}`,
            description: product.shortDescription || product.longDescription,
            id: product.id,
            metadata: {},
            group_ids: lodash_1.default.intersection(product.categories.map(cat => cat.slug), fileCategories.map(cat => cat.slug)),
            variations: product.variants.map(variant => {
                let transformed = {};
                variant.images.forEach((image, index) => {
                    transformed[`image-${index}`] = image.url;
                });
                Object.keys(variant.attributes).forEach(key => {
                    transformed[`attribute-${key}`] = variant.attributes[key];
                });
                return {
                    id: variant.sku,
                    sku: variant.sku,
                    listPrice: variant.listPrice,
                    salePrice: variant.salePrice,
                    url: `https://machathon2022-demostore.vercel.app/product/${product.id}/${product.slug}`,
                    description: product.shortDescription || product.longDescription,
                    metadata: transformed
                };
            })
        };
    });
    console.log(`updating items...`);
    const productChunks = lodash_1.default.chunk(products, 1000);
    yield async_1.default.eachOfSeries(productChunks, (chunk, index, callback) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`processing product chunk ${index + 1}/${productChunks.length}`);
        yield constructorio.catalog.addOrUpdateItemsBatch({ items: chunk, section: 'Products' });
        callback();
    }));
});
run();
