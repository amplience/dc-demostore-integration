import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../../types'
import { CodecConfiguration, Codec, registerCodec, CommerceCodec } from '../..'
import { API, CommerceAPI } from '../../..'
import Moltin, { Catalog, Hierarchy, Price, File, PriceBook, PriceBookPriceBase } from '@moltin/sdk'
import OAuthRestClient, { OAuthCodecConfiguration } from '../../../common/rest-client'
import mappers from './mappers'
import { findInMegaMenu } from '../common'
import qs from 'qs'
import { EPCustomerGroup } from './types'

export interface ElasticPathCommerceCodecConfig extends OAuthCodecConfiguration {
    client_id: string
    client_secret: string
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

const epCodec: CommerceCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/elasticpath',
    getAPI: function (config: ElasticPathCommerceCodecConfig): CommerceAPI {
        if (!config.pcm_url) {
            return null
        }

        const rest = OAuthRestClient(config, qs.stringify({
            grant_type: 'client_credentials',
            client_id: config.client_id,
            client_secret: config.client_secret
        }))

        let catalog = null
        let megaMenu = null

        const fetch = async url => (await rest.get({ url })).data
        const api = {
            getProductById: (id: string): Promise<AttributedProduct> => fetch(`/pcm/products/${id}`),
            getProductBySku: async (sku: string): Promise<AttributedProduct> => _.first(await fetch(`/pcm/products/?filter=like(sku,string:${sku})`)),
            getFileById: (id: string): Promise<File> => fetch(`/v2/files/${id}`),
            getPricebooks: (): Promise<PriceBook[]> => fetch(`/pcm/pricebooks`),
            getPricebookById: (id: string): Promise<PriceBook> => fetch(`/pcm/pricebooks/${id}`),
            getHierarchyById: (id: string): Promise<Hierarchy> => fetch(`/pcm/hierarchies/${id}`),
            getPriceForSkuInPricebook: async (sku: string, pricebook: PriceBook): Promise<PriceBookPriceBase> => _.first(await fetch(`/pcm/pricebooks/${pricebook.id}/prices?filter=eq(sku,string:${sku})`)),
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
            getCatalog: async (): Promise<Catalog> => {
                return catalog = catalog || _.find((await fetch(`catalogs`)), cat => cat.attributes?.name === config.catalog_name)
            },
            getMegaMenu: async (): Promise<Hierarchy[]> => {
                return await Promise.all((await api.getCatalog()).attributes.hierarchy_ids.map(await api.getHierarchyById))
            },
            getProductsByNodeId: (hierarchyId: string, nodeId: string): Promise<Moltin.Product[]> => fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/products`),
            getChildrenByHierarchyId: (id: string): Promise<Moltin.Node[]> => fetch(`/pcm/hierarchies/${id}/children`),
            getChildrenByNodeId: (hierarchyId: string, nodeId: string): Promise<Moltin.Node[]> => fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children`),
            getCustomerGroups: (): Promise<EPCustomerGroup[]> => fetch(`/v2/flows/customer-group/entries`)
        }

        const mapper = mappers(api)
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

        // CommerceAPI
        const getProduct = async function (args: GetCommerceObjectArgs): Promise<Product> {
            if (args.id) {
                return mapper.mapProduct(await api.getProductById(args.id))
            }
            throw new Error(`getProduct(): must specify id`)
        }

        const getProducts = async function (args: GetProductsArgs): Promise<Product[]> {
            if (args.productIds) {
                return await Promise.all(args.productIds.split(',').map(async id => await getProduct({ id })))
            }
            else if (args.keyword) {
                // ep does not yet have keyword search enabled. so for the time being, we are emulating it with sku search
                return [await mapper.mapProduct(await api.getProductBySku(args.keyword))]
            }
            throw new Error(`getProducts(): must specify either productIds or keyword`)
        }

        const getCategory = async function (args: GetCommerceObjectArgs): Promise<Category> {
            if (!args.slug) {
                throw new Error(`getCategory(): must specify slug`)
            }
            return await populateCategory(findInMegaMenu(megaMenu, args.slug) as ElasticPathCategory)
        }

        const getMegaMenu = async function (): Promise<Category[]> {
            return megaMenu = megaMenu || await Promise.all((await api.getMegaMenu()).map(await mapper.mapHierarchy))
        }

        const getCustomerGroups = async function (): Promise<CustomerGroup[]> {
            return (await api.getCustomerGroups()).map(mapper.mapCustomerGroup)
        }
        // end CommerceAPI

        return {
            getProduct,
            getProducts,
            getCategory,
            getMegaMenu,
            getCustomerGroups
        }
    }
}

export default epCodec
registerCodec(epCodec)