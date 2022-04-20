import _ from 'lodash'
import { Product, Category, QueryContext, Image, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs } from '../../types'
import { CodecConfiguration, Codec } from '..'
import { API, CommerceAPI } from '../..'
import Moltin, { Catalog, Hierarchy, Price, File } from '@moltin/sdk'
import OAuthRestClient, { OAuthRestClientInterface } from '../../common/rest-client'
import { formatMoneyString } from '../../util'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpMethod } from 'dc-management-sdk-js'
import slugify from 'slugify'

export interface FabricCommerceCodecConfig extends CodecConfiguration {
    username: string
    password: string
    accountId: string
}

const FabricRestClient = (config: FabricCommerceCodecConfig): OAuthRestClientInterface => {
    let authClient: AxiosInstance = null
    const authenticate = async () => {
        if (!authClient) {
            let authResponse = await axios({
                url: `https://sandbox.copilot.fabric.inc/api-identity/auth/local/login`,
                method: HttpMethod.POST,
                data: config
            })

            let accessToken = authResponse.data.accessToken
            authClient = axios.create({
                headers: {
                    Authorization: accessToken
                }
            })
            setTimeout(() => { authenticate() }, 600000)
        }
    }

    return {
        get: async (request: AxiosRequestConfig) => {
            return (await authClient(request)).data
        },
        authenticate
    }
}

const mapCategory = category => ({
    id: category.id,
    key: slugify(category.name, { lower: true }),
    slug: slugify(category.name, { lower: true }),
    name: category.name,
    children: category.children.map(mapCategory),
    products: []
})

let rest: OAuthRestClientInterface = undefined
let megaMenu: Category[] = undefined

const expandCategory = (category: Category) => [category, ..._.flatMapDeep(category.children, expandCategory)]
const locateCategoryForKey = async (key: string): Promise<Category> => {
    return _.find(_.flatMapDeep(megaMenu, expandCategory), c => c.key === key)
}

export class FabricCommerceCodec implements Codec, CommerceAPI {
    SchemaURI: string
    getAPI(config: CodecConfiguration): any {
        throw new Error('Method not implemented.')
    }
    canUseConfiguration(config: CodecConfiguration): boolean {
        throw new Error('Method not implemented.')
    }
    // constructor(config: FabricCommerceCodecConfig) {
    //     super(config)
    //     if (!rest) {
    //         rest = FabricRestClient(config)
    //     }
    // }

    // async start() {
    //     await rest.authenticate()
    //     console.log(`authenticated to [ fabric ]`)
    // }

    // commerce codec api implementation
    async getProduct(args: GetCommerceObjectArgs): Promise<Product> {
        throw new Error(`product no!`)
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        throw new Error(`products no!`)
    }

    async getCategory(args: GetCommerceObjectArgs): Promise<Category> {
        let category = await locateCategoryForKey(args.slug)

        let x = await rest.get({
            url: `https://sandbox.copilot.fabric.inc/api-pim2/v1/item/search`,
            method: HttpMethod.POST,
            data: {
                "page": 0,
                "size": 50,
                "sort": [
                    {
                        "direction": "DESC",
                        "field": "createdOn"
                    }
                ],
                "exclude": {
                    "files": true,
                    "statuses": true
                },
                "match": {
                    "and": [
                        {
                            "ancestorId": category.id,
                            "type": "ITEM",
                            "parentId": null
                        }
                    ]
                }
            },
            headers: {
                'content-type': 'application/json'
            }
        })

        category.products = _.map(x.items, (prod): Product => {
            const attributes = _.map(prod.attributes, (a: any) => ({ name: a.name, value: a.valueText }))
            const productName = _.find(attributes, att => att.name === 'title').value
            return {
                id: prod.itemId,
                name: productName,
                slug: slugify(productName, { lower: true }),
                shortDescription: '',
                longDescription: '',
                categories: [],
                variants: [{
                    sku: _.find(attributes, att => att.name === 'sku').value,
                    images: [{
                        url: _.find(attributes, att => att.name === 'Image 1').value
                    }],
                    listPrice: '',
                    salePrice: '',
                    attributes: prod.attributes
                }]
            }
        })

        console.log(JSON.stringify(_.first(category.products), undefined, 4))
        return category
    }

    async getMegaMenu(): Promise<Category[]> {
        if (!megaMenu) {
            // the 'categories[0].children' of the node returned from this URL are the top level categories
            let categories: any[] = _.get(await rest.get({ url: `https://sandbox.copilot.fabric.inc/api-category/v1/category?page=1&size=100&type=ALL` }), 'categories[0].children')
            if (categories) {
                return megaMenu = categories.map(mapCategory)
            }
            else {
                throw new Error('megaMenu node not found')
            }
        }
    }

    async getCustomerGroups(): Promise<CustomerGroup[]> {
        return []
    }
    // end commerce codec api implementation
}

export default {
    // codec generator conformance
    SchemaURI: 'https://demostore.amplience.com/site/integration/fabric',
    // getInstance: async (config) => {
    //     let codec = new FabricCommerceCodec(config)
    //     await codec.start()
    //     return codec
    // }
    // end codec generator conformance
}