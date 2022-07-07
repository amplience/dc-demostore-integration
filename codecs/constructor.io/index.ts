import _, { Dictionary } from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Image } from '../../../common/types'
import { CodecPropertyConfig, OldCommerceCodec, registerCodec } from '../..'
import { StringProperty } from "../Property"
import { CommerceAPI } from '../../..'
import { CodecTypes } from '../../index'
import { ConstructorIO, ConstructorIOCategory, ConstructorIOProduct } from './types'
import { findInMegaMenu } from '../common'
import slugify from 'slugify'
import axios from 'axios'
import btoa from 'btoa'
import { sleep } from '../../../common/util'

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

const constructorIOCodec: OldCommerceCodec = {
    metadata: {
        type:   CodecTypes.commerce,
        vendor: 'constructor.io',
        properties
    },
    getAPI: async function (config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        const fetch = async (url: string): Promise<any> => {
            try {
                return (await axios.get(url, {
                    baseURL: `https://ac.cnstrc.com`,
                    headers: {
                        Authorization: `Basic ${btoa(`${config.api_token}:`)}`
                    },
                    params: {
                        key: config.api_key
                    }
                })).data
            } catch (error) {
                if (error.message.indexOf('429') > -1 || error.status === 429) { // rate limited, wait 10 seconds and try again
                    await sleep(10000)
                    return await fetch(url)
                }
            }
        }

        const constructorio: ConstructorIO = { 
            catalog: {
                getItem: async ({ id, section }: { id: any; section: any }, networkParameters?: any): Promise<any> => {
                    return _.first((await fetch(`/v1/item?section=${section}&id=${id}`))?.items)
                },
                getItemGroups: async (networkParameters?: any): Promise<any> => {
                    return await fetch(`/v1/item_groups`)
                }
            },
            search: {
                getSearchResults: async (query: any, parameters?: any, userParameters?: any, networkParameters?: any): Promise<any> => {
                    return await fetch(`/search/${query}`)
                }
            }, 
            browse: {
                getBrowseResults: async (filterName: any, filterValue: any, parameters?: any, userParameters?: any, networkParameters?: any): Promise<any> => {
                    return await fetch(`/browse/${filterName}/${filterValue}`)
                }
            }
        }

        const mapCategory = (category: ConstructorIOCategory): Category => ({
            id: category.id,
            slug: category.id,
            name: category.name,
            children: category.children.map(mapCategory),
            products: []
        })

        const mapProduct = (product: ConstructorIOProduct): Product => {
            return {
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
            }
        }

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