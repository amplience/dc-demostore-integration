import fs from 'fs-extra'
import { Category } from './common';
import async from 'async'
import _ from 'lodash';

const ConstructorIOClient = require('@constructor-io/constructorio-node');
const constructorio = new ConstructorIOClient({
    apiKey: '********',
    apiToken: '********'
});

const run = async () => {
    console.log(`reading item groups...`)
    let fileCategories = fs.readJSONSync(`/Users/dave/work/data/commercetools/categories.json`)
    let categories = fileCategories.map(category => ({
        id: category.slug,
        name: category.name,
        parent_id: fileCategories.find(cat => cat.id === category.parent?.id)?.slug
    }))

    // console.log(`updating item groups...`)
    // await async.eachSeries(categories, async (category, callback) => {
    //     let itemGroup = await constructorio.catalog.getItemGroup(category.id)
    //     if (!itemGroup) {
    //         console.log(`creating item group [ ${category.id} ]...`)
    //         await constructorio.catalog.addItemGroup(category)
    //     }
    //     callback()
    // })

    console.log(`reading items...`)
    let fileProducts = fs.readJSONSync(`/Users/dave/work/data/commercetools/products.json`)
    let products = fileProducts.map(product => {
        let imageSetId = product.imageSetId

        if (imageSetId) {
            while (imageSetId.length < 6) {
                imageSetId = `0${imageSetId}`
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
            group_ids: _.intersection(product.categories.map(cat => cat.slug), fileCategories.map(cat => cat.slug)),
            variations: product.variants.map(variant => {
                let transformed = {}
                variant.images.forEach((image, index) => {
                    transformed[`image-${index}`] = image.url
                })

                Object.keys(variant.attributes).forEach(key => {
                    transformed[`attribute-${key}`] = variant.attributes[key]
                })

                return {
                    id: variant.sku,
                    sku: variant.sku,
                    listPrice: variant.listPrice,
                    salePrice: variant.salePrice,
                    url: `https://machathon2022-demostore.vercel.app/product/${product.id}/${product.slug}`,
                    description: product.shortDescription || product.longDescription,
                    metadata: transformed
                }
            })
        }
    })

    console.log(`updating items...`)

    const productChunks = _.chunk(products, 1000)
    await async.eachOfSeries(productChunks, async (chunk, index, callback) => {
        console.log(`processing product chunk ${index + 1}/${productChunks.length}`)
        await constructorio.catalog.addOrUpdateItemsBatch({ items: chunk, section: 'Products' })
        callback()
    })
}

run()