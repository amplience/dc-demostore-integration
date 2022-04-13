import _ from 'lodash'
import { Product, Category, QueryContext, qc, CustomerGroup } from '../../../types'
import { CodecConfiguration, Codec, registerCodec } from '../..'
import { CommerceAPI } from '../../..'
import Moltin, { Catalog, Hierarchy, Price, File, PriceBook, PriceBookPriceBase } from '@moltin/sdk'
import OAuthRestClient from '../../../common/rest-client'
import mappers from './mappers'
import { findInMegaMenu } from '../common'

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

const epCodec: Codec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/elasticpath',
    getAPI: async function (config: ElasticPathCommerceCodecConfig): Promise<CommerceAPI> {
        const rest = OAuthRestClient(config)
        await rest.authenticate({
            grant_type: 'client_credentials',
            client_id: config.client_id,
            client_secret: config.client_secret
        })

        const fetch = async url => (await rest.get({ url })).data
        const api = {
            getProductById: (id: string): Promise<AttributedProduct> => fetch(`/pcm/products/${id}`),
            getProductBySku: async (sku: string): Promise<AttributedProduct> => _.first(await fetch(`/pcm/products/?filter=like(sku,string:${sku})`)),
            getFileById: (id: string): Promise<File> => fetch(`/v2/files/${id}`),
            getPricebooks: (): Promise<PriceBook[]> => fetch(`/pcm/pricebooks`),
            getPricebookById: (id: string): Promise<PriceBook> => fetch(`/pcm/pricebooks/${id}`),
            getHierarchyById: (id: string): Promise<Hierarchy> => fetch(`/pcm/hierarchies/${id}`),
            getPriceForSkuInPricebook: async (sku: string, pricebook: PriceBook): Promise<PriceBookPriceBase> => _.first((await rest.get({ url: `/pcm/pricebooks/${pricebook.id}/prices?filter=eq(sku,string:${sku})` })).data),
            getPriceForSku: async (sku: string): Promise<Price> => {
                let prices: PriceBookPriceBase[] = await api.getPricesForSku(sku)
                let priceBookPrice: PriceBookPriceBase = _.find(prices, (price: PriceBookPrice) => price.pricebook.id === catalog.attributes.pricebook_id && !!price.attributes?.currencies) ||
                    _.find(prices, price => !!price.attributes?.currencies)
                return {
                    ...priceBookPrice?.attributes.currencies['USD'],
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

        let catalog = await api.getCatalog(config.catalog_name)
        let mapper = mappers(api)
        let megaMenu = await Promise.all((await api.getMegaMenu(config.catalog_name)).map(await mapper.mapHierarchy))

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
            return await Promise.all(products.map(await mapper.mapProduct))
        }

        return {
            getProduct: async function (query: QueryContext): Promise<Product> {
                if (query.args.id) {
                    return mapper.mapProduct(await api.getProductById(query.args.id))
                }
                throw new Error(`getProduct(): must specify id`)
            },
            getProducts: async function (query: QueryContext): Promise<Product[]> {
                if (query.args.productIds) {
                    return await Promise.all(query.args.productIds.split(',').map(async productId => {
                        return await this.getProduct(qc({ args: { id: productId } }))
                    }))
                }
                else if (query.args.keyword) {
                    // ep does not yet have keyword search enabled. so for the time being, we are emulating it with sku search
                    return [await mapper.mapProduct(await api.getProductBySku(query.args.keyword))]
                }
                throw new Error(`getProducts(): must specify either productIds or keyword`)
            },
            getCategory: async function (query: QueryContext): Promise<Category> {
                if (!query.args.slug) {
                    throw new Error(`getCategory(): must specify slug`)
                }
                return await populateCategory(findInMegaMenu(megaMenu, query.args.slug) as ElasticPathCategory)
            },
            getMegaMenu: async function (): Promise<Category[]> {
                return megaMenu
            },
            getCustomerGroups: async function (): Promise<CustomerGroup[]> {
                return []
            }
        }
    },
    canUseConfiguration: function (config: any): boolean {
        return config.client_id && config.client_secret && config.pcm_url && config.auth_url && config.api_url && config.catalog_name
    }
}

export default epCodec
registerCodec(epCodec)