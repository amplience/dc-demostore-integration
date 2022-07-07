import { Category, ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthProperties, OAuthRestClient, OAuthRestClientInterface, Product, Image } from "../../../common";
import _ from "lodash";
import { Dictionary } from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import qs from "qs";
import Moltin, { gateway as MoltinGateway, Moltin as MoltinApi, PriceBookPriceBase } from '@moltin/sdk'
import slugify from "slugify";
import { formatMoneyString } from "../../../common/util";

type CodecConfig = ClientCredentialsConfiguration & {
    pcm_url: StringProperty
    catalog_name: StringProperty
}

export class ElasticPathCommerceCodecType extends CommerceCodecType {
    get vendor(): string {
        return 'elasticpath'
    }

    get properties(): CodecConfig {
        return {
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
    }

    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new ElasticPathCommerceCodec(config).init()
    }
}

export class ElasticPathCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>

    // instance variables
    rest: OAuthRestClientInterface
    moltin: MoltinApi
    catalog: Moltin.Catalog
    pricebooks: Moltin.PriceBook[]

    async init(): Promise<CommerceCodec> {
        this.moltin = MoltinGateway({
            client_id: this.config.client_id,
            client_secret: this.config.client_secret
        })

        this.rest = OAuthRestClient(this.config, qs.stringify({
            grant_type: 'client_credentials',
            client_id: this.config.client_id,
            client_secret: this.config.client_secret
        }))
        return await super.init()
    }

    async fetch(url: string): Promise<any> {
        let response = await this.rest.get({ url })
        return response && response.data
    }

    getHierarchyRootNode(category: Category): Category {
        if (category.parent) {
            const parent = this.findCategory(category.parent.slug)
            return this.getHierarchyRootNode(parent)
        }
        return category    
    }

    async getFileById(id: string): Promise<Moltin.File> { 
        return await this.fetch(`/v2/files/${id}`) 
    }

    async mapProduct(product: any): Promise<Product> {
        let attributes: Dictionary<string> = {}
        let images: Image[] = []
    
        if (product.relationships.main_image?.data?.id) {
            let mainImage = await this.getFileById(product.relationships.main_image?.data?.id)
            images.push({ url: mainImage?.link?.href })
        }
    
        let price = await this.getPriceForSku(product.attributes.sku)
        let productPrice = formatMoneyString(price.amount / 100, { currency: 'USD' })
    
        _.each(product.attributes?.extensions, (extension, key) => {
            _.each(extension, (v, k) => {
                if (k.indexOf('image') > -1) {
                    images.push({ url: v })
                }
                else if (v) {
                    attributes[k] = v
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
            name: product.attributes.name,
            shortDescription: product.attributes.description,
            longDescription: product.attributes.description,
            categories: [],
            variants
        }
    }

    async getPriceForSkuInPricebook(sku: string, pricebookId: string): Promise<PriceBookPriceBase> {
        return _.first(await this.fetch(`/pcm/pricebooks/${pricebookId}/prices?filter=eq(sku,string:${sku})`))
    }

    async getPriceForSku(sku: string): Promise<{ amount: number }> {
        let base: PriceBookPriceBase = await this.getPriceForSkuInPricebook(sku, this.catalog.attributes.pricebook_id)
        if (!base) {
            let prices = await Promise.all(this.pricebooks.map(async pricebook => await this.getPriceForSkuInPricebook.bind(this)(sku, pricebook.id)))
            base = _.find(prices, x => x)
        }

        return base ? {
            amount: base.attributes.currencies['USD'].amount
        } : { amount: 0 }
    }

    async getProductsForHierarchy(hierarchyId: string): Promise<Moltin.Product[]> {
        return await this.fetch(`/catalog/hierarchies/${hierarchyId}/products`)
    }

    async getProductsForNode(nodeId: string): Promise<Moltin.Product[]> {
        return await this.fetch(`/catalog/nodes/${nodeId}/relationships/products`)
    }

    async getHierarchy(hierarchyId: string): Promise<Category> {
        const hierarchy = await (await this.moltin.Hierarchies.Get(hierarchyId)).data
        const children = await this.fetch(`/pcm/hierarchies/${hierarchyId}/children`)

        return {
            id: hierarchy.id,
            name: hierarchy.attributes.name,
            slug: hierarchy.attributes.slug || slugify(hierarchy.attributes.name, { lower: true }),
            children: await Promise.all(children.map(async child => await this.getNode.bind(this)(hierarchy.id, child.id))),
            products: []
        }
    }

    async getNode(hierarchyId: string, nodeId: string): Promise<Category> {
        const node = await this.fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}`)        
        const children = await this.fetch(`/pcm/hierarchies/${hierarchyId}/nodes/${nodeId}/children`)

        return {
            id: node.id,
            name: node.attributes.name,
            slug: node.attributes.slug || slugify(node.attributes.name, { lower: true }),
            children: await Promise.all(children.map(async child => await this.getNode.bind(this)(hierarchyId, child.id))),
            products: []
        }
    }

    async cacheMegaMenu(): Promise<void> {
        this.catalog = _.find(await (await this.moltin.Catalogs.All()).data, cat => cat.attributes?.name === this.config.catalog_name)
        this.megaMenu = await Promise.all(this.catalog.attributes.hierarchy_ids.map(this.getHierarchy.bind(this)))
        this.pricebooks = await this.fetch(`/pcm/pricebooks`)
    }

    async getProductById(productId: string): Promise<Moltin.Product> {
        return await this.fetch(`/pcm/products/${productId}`)
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        let products: any[] = []

        if (args.productIds) {
            products = await Promise.all(args.productIds.split(',').map(this.getProductById.bind(this)))
        }   
        else if (args.keyword) {
            products = await this.fetch(`/pcm/products?filter=eq(sku,${args.keyword})`)
        }
        else if (args.category) {
            let hierarchyRoot = this.getHierarchyRootNode(args.category)
            if (hierarchyRoot.id === args.category.id) {
                products = await this.getProductsForHierarchy(args.category.id)                
            }
            else {
                products = await this.getProductsForNode(args.category.id)
            }
        }
        return await Promise.all(products.map(this.mapProduct.bind(this)))
    }

    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
        return this.fetch(`/v2/flows/customer-group/entries`)
    }
}

export default ElasticPathCommerceCodecType
registerCodec(new ElasticPathCommerceCodecType())