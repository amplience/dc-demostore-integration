import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../../types'
import { Codec, CodecStringConfig, StringProperty } from '../..'
import { CommerceAPI } from '../../..'
import Moltin, { Catalog, Hierarchy, Price, File, PriceBook, PriceBookPriceBase } from '@moltin/sdk'
import OAuthRestClient, { ClientCredentialProperties, ClientCredentialsConfiguration, OAuthCodecConfiguration, OAuthProperties } from '../../../common/rest-client'
import mappers from './mappers'
import { findInMegaMenu } from '../common'
import qs from 'qs'
import { EPCustomerGroup } from './types'

type CodecConfig = OAuthCodecConfiguration & ClientCredentialsConfiguration & {
    pcm_url:        StringProperty
    catalog_name:   StringProperty
}

const properties: CodecConfig = {
    ...OAuthProperties,
    ...ClientCredentialProperties,
    pcm_url: {
        title: "PCM URL",
        type: "string"
    },
    catalog_name: {
        title: "Catalog name",
        type: "string"
    }
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
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/elasticpath',
        icon: 'https://pbs.twimg.com/profile_images/1138115910449844226/PBnkfVHY_400x400.png',
        properties
    },
    getAPI: async (config: CodecStringConfig<CodecConfig>): Promise<CommerceAPI> => {
        if (!config.pcm_url) {
            return null
        }

        const rest = OAuthRestClient(config, qs.stringify({
            grant_type: 'client_credentials',
            client_id: config.client_id,
            client_secret: config.client_secret
        }))

        const fetch = async url => (await rest.get({ url })).data
        
        let catalog = _.find((await fetch(`catalogs`)), cat => cat.attributes?.name === config.catalog_name)
        const api = {
            getProductById: (id: string): Promise<AttributedProduct> => fetch(`/pcm/products/${id}`),
            getProductBySku: async (sku: string): Promise<AttributedProduct> => _.first(await fetch(`/pcm/products/?filter=like(sku,string:${sku})`)),
            getFileById: (id: string): Promise<File> => fetch(`/v2/files/${id}`),
            getPricebooks: (): Promise<PriceBook[]> => fetch(`/pcm/pricebooks`),
            getPricebookById: (id: string): Promise<PriceBook> => fetch(`/pcm/pricebooks/${id}`),
            getHierarchyById: (id: string): Promise<Hierarchy> => fetch(`/pcm/hierarchies/${id}`),
            getPriceForSkuInPricebook: async (sku: string, pricebook: PriceBook): Promise<PriceBookPriceBase> => _.first(await fetch(`/pcm/pricebooks/${pricebook.id}/prices?filter=eq(sku,string:${sku})`)),
            getPriceForSku: async (sku: string): Promise<Price> => {
                let cat = await api.getCatalog()
                let prices: PriceBookPriceBase[] = await api.getPricesForSku(sku)
                let priceBookPrice: PriceBookPriceBase = _.find(prices, (price: PriceBookPrice) => price.pricebook.id === cat.attributes.pricebook_id && !!price.attributes?.currencies) ||
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
                return catalog
            },
            getMegaMenu: async (): Promise<Hierarchy[]> => {
                return await Promise.all((await api.getCatalog()).attributes.hierarchy_ids.map(await api.getHierarchyById))
            },
            getProductsByNodeId: (hierarchyId: string, nodeId: string): Promise<Moltin.Product[]> => fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/products`),
            getChildrenByHierarchyId: (id: string): Promise<Moltin.Node[]> => fetch(`/pcm/hierarchies/${id}/children`),
            getChildrenByNodeId: (hierarchyId: string, nodeId: string): Promise<Moltin.Node[]> => fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children`),
            getCustomerGroups: (): Promise<EPCustomerGroup[]> => fetch(`/v2/flows/customer-group/entries`)
        }
        
        // _.each(Object.keys(api), key => {
        //     let method = api[key]
        //     api[key] = async (...args) => {
        //         let start = new Date().valueOf()
        //         let result = await method(...args)
        //         console.log(`${key}: ${new Date().valueOf() - start}ms`)
        //         return result
        //     }
        // })
        
        const mapper = mappers(api)
        let megaMenu = await Promise.all((await api.getMegaMenu()).map(await mapper.mapHierarchy))
        const populateCategory = async (category: ElasticPathCategory): Promise<ElasticPathCategory> => ({
            ...category,
            products: await getProductsFromCategory(category)
        })
        
        const getProductsFromCategory = async (category: ElasticPathCategory): Promise<Product[]> => {
            let products: Moltin.Product[] = []
            if (category.id === category.hierarchyId) {
                products = _.uniqBy(_.flatten(_.take(await Promise.all(category.children.map(async child => await api.getProductsByNodeId(category.hierarchyId, child.id))), 1)), x => x.id)
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
            let category = findInMegaMenu(await getMegaMenu(), args.slug) as ElasticPathCategory
            let populated = await populateCategory(category)
            return populated
        }

        const getMegaMenu = async function (): Promise<Category[]> {
            return megaMenu
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