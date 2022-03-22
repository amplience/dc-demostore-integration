import _ from 'lodash'
import { Product, Category, QueryContext, Attribute, ProductImage } from '../../types'
import { CodecConfiguration, Codec } from '..'
import { CommerceAPI } from '../..'
import Moltin, { Catalog, Hierarchy, Price, File } from '@moltin/sdk'
import OAuthRestClient, { OAuthRestClientInterface } from '../../common/rest-client'
import { formatMoneyString } from '../../util'

export interface ElasticPathCommerceCodecConfig extends CodecConfiguration {
    client_id: string
    client_secret: string
    api_url: string
    auth_url: string
    pcm_url: string
}

export interface AttributedProduct extends Moltin.Product {
    id: string
    attributes: any
}

export interface NodeLocator {
    hierarchyId: string
    nodeId: string
}

export interface CategoryWithHierarchyId extends Category {
    hierarchyId: string
}

const api = {
    getProductById: async (id: string): Promise<AttributedProduct> => (await rest.get({ url: `/pcm/products/${id}` })).data,
    getFileById: async (id: string): Promise<File> => (await rest.get({ url: `/v2/files/${id}` })).data,
    getPrices: async (name: string): Promise<Price[]> => {
        let retailPricebook = _.find((await rest.get({ url: `/pcm/pricebooks` })).data, pb => pb.attributes.name === name)
        if (retailPricebook) {
            return (await rest.get({ url: `/pcm/pricebooks/${retailPricebook.id}/prices` }))?.data
        }
        return []
    },
    getMegaMenu: async (name: string): Promise<Hierarchy[]> => {
        let catalogs = (await rest.get({ url: '/catalogs' })).data
        let catalog: Catalog = _.find(catalogs, cat => cat.attributes?.name === name)
        return await Promise.all(catalog.attributes.hierarchy_ids.map(async (id: string) => (await rest.get({ url: `/pcm/hierarchies/${id}` })).data))
    },
    getProductsByHierarchyId: async (id: string): Promise<Moltin.Product[]> => {
        return (await rest.get({ url: `/pcm/hierarchies/${id}/products` })).data
    },
    getProductsByNodeId: async (hierarchyId: string, nodeId: string): Promise<Moltin.Product[]> => {
        return (await rest.get({ url: `/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/products` })).data
    },
    getChildrenByHierarchyId: async (id: string): Promise<Moltin.Node[]> => {
        return (await rest.get({ url: `/pcm/hierarchies/${id}/children` })).data
    },
    getChildrenByNodeId: async (hierarchyId: string, nodeId: string): Promise<Moltin.Node[]> => {
        return (await rest.get({ url: `/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children` })).data
    }
}

let rest: OAuthRestClientInterface = undefined

// mappers
const mapProduct = async (skeletonProduct: AttributedProduct): Promise<Product> => {
    if (!skeletonProduct) {
        return undefined
    }

    let product: AttributedProduct = await api.getProductById(skeletonProduct.id)
    let attributes: Attribute[] = []
    let images: ProductImage[] = []

    if (product.relationships.main_image?.data?.id) {
        let mainImage = await api.getFileById(product.relationships.main_image?.data?.id)
        images.push({ url: mainImage?.link?.href })
    }

    let productPrice = product.attributes?.price?.USD?.amount
    let prices: Price[] = await api.getPrices('Retail Pricing')
    let price = _.find(prices, price => price.attributes.sku.toLowerCase() === product.attributes.sku.toLowerCase())
    productPrice = formatMoneyString(price?.attributes.currencies.USD?.amount / 100, { currency: 'USD' })

    _.each(product.attributes?.extensions, (extension, key) => {
        _.each(extension, (v, k) => {
            if (k.indexOf('image') > -1) {
                images.push({ url: v })
            }
            else if (v) {
                attributes.push({ name: k, value: v })
            }
        })
    })

    return {
        id: product.id,
        slug: product.attributes.slug,
        key: product.attributes.slug,
        name: product.attributes.name,
        shortDescription: product.attributes.description,
        productType: product.type,
        categories: [],
        variants: [{
            sku: product.attributes.sku,
            prices: {
                list: productPrice,
            },
            listPrice: productPrice,
            salePrice: productPrice,
            images,
            attributes,
            key: product.attributes.slug,
            id: product.id
        }]
    }
}

const mapNode = (hierarchy: Hierarchy) => async (node: Moltin.Node): Promise<CategoryWithHierarchyId> => ({
    hierarchyId: hierarchy.id,
    name: node.attributes.name,
    id: node.id,
    slug: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
    key: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
    children: await Promise.all((await api.getChildrenByNodeId(hierarchy.id, node.id)).map(await mapNode(hierarchy))),
    products: []
})

const mapHierarchy = async (hierarchy: Hierarchy): Promise<CategoryWithHierarchyId> => ({
    hierarchyId: hierarchy.id,
    name: hierarchy.attributes.name,
    id: hierarchy.id,
    slug: hierarchy.attributes.slug,
    key: hierarchy.attributes.slug,
    children: await Promise.all((await api.getChildrenByHierarchyId(hierarchy.id)).map(await mapNode(hierarchy))),
    products: []
})
// end mappers

// utility methods
const populateCategory = async (category: CategoryWithHierarchyId): Promise<CategoryWithHierarchyId> => ({
    ...category,
    products: await getProductsFromCategory(category)
})

const getProductsFromCategory = async (category: CategoryWithHierarchyId): Promise<Product[]> => {
    let products: Product[] = []
    if (category.id === category.hierarchyId) {
        products = await Promise.all((await api.getProductsByHierarchyId(category.hierarchyId)).map(await mapProduct))
    }
    else if (category.hierarchyId) {
        products = await Promise.all((await api.getProductsByNodeId(category.hierarchyId, category.id)).map(await mapProduct))
    }
    return products
}

const expandCategory = (category: Category) => [category, ..._.flatMapDeep(category.children, expandCategory)]

const locateCategoryForKey = async (slug: string): Promise<CategoryWithHierarchyId> => {
    let category = _.find(_.flatMapDeep(megaMenu, expandCategory), c => c.slug === slug)
    return await populateCategory(category)
}
// end utility methods

let megaMenu: Category[] = []
export class ElasticPathCommerceCodec extends Codec implements CommerceAPI {
    constructor(config: ElasticPathCommerceCodecConfig) {
        super(config)
        if (!rest) {
            rest = OAuthRestClient(config)
        }
    }

    async start() {
        await rest.authenticate()
        megaMenu = await Promise.all((await api.getMegaMenu('Teacher Specials')).map(await mapHierarchy))
    }

    // commerce codec api implementation
    async getProduct(context: QueryContext): Promise<Product> {
        return await mapProduct(await api.getProductById(context.args.id))
    }

    async getProducts(context: QueryContext): Promise<Product[]> {
        if (context.args.productIds) {
            return await Promise.all(context.args.productIds.split(',').map(async productId => {
                return await this.getProduct(new QueryContext({ args: { id: productId } }))
            }))
        }
        else if (context.args.keyword) {
            console.warn(`keyword search not available in elasticpath`)
            return []
        }
        throw new Error(`[ ep ] keyword or productIds required`)
    }

    async getCategory(context: QueryContext): Promise<Category> {
        return await locateCategoryForKey(context.args.key)
    }

    async getMegaMenu(): Promise<Category[]> {
        return megaMenu
    }
    // end commerce codec api implementation
}

export default {
    // codec generator conformance
    SchemaURI: 'https://amprsa.net/site/integration/elasticpath',
    getInstance: async (config) => {
        let codec = new ElasticPathCommerceCodec(config)
        await codec.start()
        return codec
    }
    // end codec generator conformance
}