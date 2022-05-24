import _, { Dictionary } from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Image } from '../../../common/types'
import { CodecPropertyConfig, CommerceCodec, registerCodec, StringProperty } from '../..'
import { CommerceAPI } from '../../..'
import { CodecType } from '../../index'
import { ConstructorIO, ConstructorIOCategory, ConstructorIOProduct } from './types'
import { findInMegaMenu } from '../common'
import slugify from 'slugify'

type CodecConfig = {
    api_key: StringProperty
    api_token: StringProperty
}

const properties: CodecConfig = {
    api_key: {
        title: "API Key",
        type: "string"
    },
    api_token: {
        title: "API Token",
        type: "string"
    }
}

const constructorIOCodec: CommerceCodec = {
    schema: {
        type: CodecType.commerce,
        uri: 'https://demostore.amplience.com/site/integration/constructor.io',
        icon: 'https://media.glassdoor.com/sqll/2176466/constructor-io-squarelogo-1539215018600.png',
        properties
    },
    getAPI: async function (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        const ConstructorIOClient = require('@constructor-io/constructorio-node');
        const constructorio: ConstructorIO = new ConstructorIOClient({
            apiKey: config.api_key,
            apiToken: config.api_token
        });

        const mapCategory = (category: ConstructorIOCategory): Category => ({
            id: category.id,
            slug: category.id,
            name: category.name,
            children: category.children.map(mapCategory),
            products: []
        })

        const mapProduct = (product: ConstructorIOProduct): Product => ({
            id: product.id,
            name: product.name,
            slug: slugify(product.name, { lower: true }),
            categories: product.group_ids.map(gid => findInMegaMenu(megaMenu, gid)),
            imageSetId: product.variations[0]?.metadata['attribute-articleNumberMax']?.padStart(6, '0'),
            variants: product.variations.map(variation => {
                let attributes: Dictionary<string> = {}
                let images: Image[] = []

                _.each(variation.metadata, (value, key) => {
                    if (key.startsWith('attribute-')) {
                        attributes[key.replace('attribute-', '')] = value
                    }
                    else if (key.startsWith('image-')) {
                        images.push({ url: variation.metadata[key] })
                    }
                })

                return {
                    sku: variation.id,
                    listPrice: variation.metadata.listPrice,
                    salePrice: variation.metadata.salePrice,
                    images,
                    attributes
                }
            })
        })

        let categories = await constructorio.catalog.getItemGroups()
        let megaMenu: Category[] = categories.item_groups.map(mapCategory)

        const api = {
            getProductById: async (productId: string): Promise<Product> => {
                return mapProduct(await constructorio.catalog.getItem({ id: productId, section: 'Products' }))
            },
            getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
                return api.getProductById(args.id)
            },
            getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
                let productIds: string[] = []
                if (args.productIds) {
                    productIds = args.productIds.split(',')
                }
                else if (args.keyword) {
                    let raw = (await constructorio.search.getSearchResults(args.keyword)).response.results
                    productIds = raw.map(r => r.data.id)
                }
                return await Promise.all(productIds.map(api.getProductById))
            },
            getCategory: async (args: GetCommerceObjectArgs) => {
                return await api.populateCategory(findInMegaMenu(megaMenu, args.slug))
            },
            populateCategory: async (category: Category): Promise<Category> => {
                if (!category) { return }
                let browseResults = (await constructorio.browse.getBrowseResults('group_id', category.slug)).response.results
                return {
                    ...category,
                    products: await api.getProducts({ productIds: _.map(_.take(browseResults, 10), 'data.id').join(',') })
                }
            },
            getMegaMenu: async (): Promise<Category[]> => {
                return megaMenu
            },
            getCustomerGroups: async (): Promise<CustomerGroup[]> => {
                return []
            }
        }
        return api
    }
}
registerCodec(constructorIOCodec)