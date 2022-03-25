import _, { Dictionary } from 'lodash'
import { Product, Category, QueryContext, Attribute, ProductImage } from '../../types'
import { CodecConfiguration, Codec } from '..'
import { CommerceAPI } from '../..'
import Moltin, { Catalog, Hierarchy, Price, File, PriceBook, PriceBookPriceBase, Variation, Option } from '@moltin/sdk'
import OAuthRestClient, { OAuthRestClientInterface } from '../../common/rest-client'
import { formatMoneyString } from '../../util'

export interface ElasticPathCommerceCodecConfig extends CodecConfiguration {
    client_id: string
    client_secret: string
    api_url: string
    auth_url: string
    pcm_url: string
    catalog_name: string
}

export interface AttributedProduct extends Moltin.Product {
    id: string
    attributes: any
}

export interface NodeLocator {
    hierarchyId: string
    nodeId: string
}

export interface ElasticPathCategory extends Category {
    hierarchyId: string
}

export interface PriceBookPrice extends PriceBookPriceBase {
    pricebook: PriceBook
}

const api = {
    getProductById: async (id: string): Promise<AttributedProduct> => (await rest.get({ url: `/pcm/products/${id}` })).data,
    getProductBySku: async (sku: string): Promise<AttributedProduct> => _.first((await rest.get({ url: `/pcm/products/?filter=like(sku,string:${sku})` })).data),
    getFileById: async (id: string): Promise<File> => (await rest.get({ url: `/v2/files/${id}` })).data,
    getPricebooks: async (): Promise<PriceBook[]> => (await rest.get({ url: `/pcm/pricebooks` })).data,
    getPricebookById: async (id: string): Promise<PriceBook> => (await rest.get({ url: `/pcm/pricebooks/${id}` })).data,
    getHierarchyById: async (id: string): Promise<Hierarchy> => (await rest.get({ url: `/pcm/hierarchies/${id}` })).data,
    getPriceForSkuInPricebook: async (sku: string, pricebook: PriceBook): Promise<PriceBookPriceBase> => _.first((await rest.get({ url: `/pcm/pricebooks/${pricebook.id}/prices?filter=eq(sku,string:${sku})` })).data),
    getPriceForSku: async (sku: string): Promise<Price> => {
        let prices: PriceBookPriceBase[] = await api.getPricesForSku(sku)
        let priceBookPrice: PriceBookPriceBase = _.find(prices, (price: PriceBookPrice) => price.pricebook.id === catalog.attributes.pricebook_id && !!price.attributes.currencies) ||
            _.find(prices, price => !!price.attributes.currencies)
        return {
            ...priceBookPrice.attributes.currencies['USD'],
            currency: 'USD'
        }
    },
    getPricesForSku: async (sku: string): Promise<PriceBookPriceBase[]> => await Promise.all((await api.getPricebooks()).map(async pricebook => ({
        ...await api.getPriceForSkuInPricebook(sku, pricebook),
        pricebook
    }))),
    getCatalog: async (name: string): Promise<Catalog> => {
        let catalogs = (await rest.get({ url: '/catalogs' })).data
        return _.find(catalogs, cat => cat.attributes?.name === name)
    },
    getMegaMenu: async (name: string): Promise<Hierarchy[]> => {
        return await Promise.all((await api.getCatalog(name)).attributes.hierarchy_ids.map(await api.getHierarchyById))
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
    if (!product) {
        return undefined
    }

    let attributes: Attribute[] = []
    let images: ProductImage[] = []

    if (product.relationships.main_image?.data?.id) {
        let mainImage = await api.getFileById(product.relationships.main_image?.data?.id)
        images.push({ url: mainImage?.link?.href })
    }

    let price = await api.getPriceForSku(product.attributes.sku)
    let productPrice = formatMoneyString(price.amount / 100, { currency: 'USD' })

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

    let variants = [{
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

    // .map(opt => {
    //     return {
    //         sku: product.attributes.sku,
    //         prices: {
    //             list: productPrice,
    //         },
    //         listPrice: productPrice,
    //         salePrice: productPrice,
    //         images,
    //         attributes: _.concat(attributes, [{ name: v.name, value: opt.name }]),
    //         key: product.attributes.slug,
    //         id: product.id
    //     }
    // })

    // variants
    if (!_.isEmpty((product.meta as any).variation_matrix)) {
        let variationMatrix: Dictionary<Dictionary<string>> = (product.meta as any).variation_matrix
        let x = _.flatMap(Object.keys(variationMatrix).map(key => {
            let variation = variationMatrix[key]
            let z = _.map

            return {

            }
        }))
    }

    return {
        id: product.id,
        slug: product.attributes.slug,
        key: product.attributes.slug,
        name: product.attributes.name,
        shortDescription: product.attributes.description,
        longDescription: product.attributes.description,
        productType: product.type,
        categories: [],
        variants
    }
}

const mapNode = (hierarchy: Hierarchy) => async (node: Moltin.Node): Promise<ElasticPathCategory> => ({
    hierarchyId: hierarchy.id,
    name: node.attributes.name,
    id: node.id,
    slug: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
    key: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
    children: await Promise.all((await api.getChildrenByNodeId(hierarchy.id, node.id)).map(await mapNode(hierarchy))),
    products: []
})

const mapHierarchy = async (hierarchy: Hierarchy): Promise<ElasticPathCategory> => ({
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
const populateCategory = async (category: ElasticPathCategory): Promise<ElasticPathCategory> => ({
    ...category,
    products: await getProductsFromCategory(category)
})

const getProductsFromCategory = async (category: ElasticPathCategory): Promise<Product[]> => {
    let products: Moltin.Product[] = []
    if (category.id === category.hierarchyId) {
        products = _.flatten(await Promise.all(category.children.map(async child => await api.getProductsByNodeId(category.hierarchyId, child.id))))
    }
    else if (category.hierarchyId) {
        products = await api.getProductsByNodeId(category.hierarchyId, category.id)
    }
    return await Promise.all(products.map(await mapProduct))
}

const expandCategory = (category: Category) => [category, ..._.flatMapDeep(category.children, expandCategory)]

const locateCategoryForKey = async (slug: string): Promise<ElasticPathCategory> => {
    let category = _.find(_.flatMapDeep(megaMenu, expandCategory), c => c.slug === slug)
    return await populateCategory(category)
}
// end utility methods

let megaMenu: Category[] = []
let catalog: Catalog
export class ElasticPathCommerceCodec extends Codec implements CommerceAPI {
    config: ElasticPathCommerceCodecConfig

    constructor(config: ElasticPathCommerceCodecConfig) {
        super(config)
        if (!rest) {
            rest = OAuthRestClient(this.config)
        }
    }

    async start() {
        await rest.authenticate()
        catalog = await api.getCatalog(this.config.catalog_name)
        megaMenu = await Promise.all((await api.getMegaMenu(this.config.catalog_name)).map(await mapHierarchy))
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
            // ep does not yet have keyword search enabled. so for the time being, we are emulating it with sku search
            return [await mapProduct(await api.getProductBySku(context.args.keyword))]
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
    SchemaURI: 'https://demostore.amplience.com/site/integration/elasticpath',
    getInstance: async (config) => {
        let codec = new ElasticPathCommerceCodec(config)
        await codec.start()
        return codec
    }
    // end codec generator conformance
}