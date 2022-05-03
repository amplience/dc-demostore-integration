import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, CommonArgs } from '../../../types'
import { CodecConfiguration, CommerceCodec, registerCodec } from '../..'
import { CommerceAPI } from '../../..'
import OAuthRestClient, { OAuthCodecConfiguration } from '../../../common/rest-client'
import slugify from 'slugify'
import { findInMegaMenu } from '../common'
import { Attribute, FabricCategory, FabricProduct } from './types'

export interface FabricCommerceCodecConfig extends OAuthCodecConfiguration {
    username: string
    password: string
    accountId: string
}

let megaMenu: Category[]

const fabricCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/fabric',
    getAPI: function (config: FabricCommerceCodecConfig): CommerceAPI {
        if (!config.username) {
            return null
        }

        const rest = OAuthRestClient({
            ...config,
            auth_url: `https://sandbox.copilot.fabric.inc/api-identity/auth/local/login`
        }, {
            username: config.username,
            password: config.password,
            accountId: config.accountId
        }, {
            headers: {
                'content-type': 'application/json'
            }
        }, (auth: any) => {
            return {
                Authorization: auth.accessToken,

                // todo: what comprises site-context?
                'x-site-context': JSON.stringify({
                    "stage": "sandbox",
                    "account": "62095c9437d1c60011d8c3cf",
                    "date": "2021-07-19T23:41:54.179Z",
                    "channel": 12
                })
            }
        })
        const fetch = async url => await rest.get({ url })

        const getProductAttributes = async function (sku: string): Promise<Attribute[]> {
            return _.get(await fetch(`/api-product/v1/product/attribute?sku=${sku}`), 'attributes')
        }

        const getProductsForCategory = async function (category: Category): Promise<Product[]> {
            let skus = _.take(_.get(await fetch(`/api-category/v1/category/sku?id=${category.id}`), 'skus'), 20)
            return _.isEmpty(skus) ? [] : await getProducts({ productIds: skus.join(',') })
        }

        const mapCategory = (category: FabricCategory): Category => ({
            id: category.id,
            slug: slugify(category.name, { lower: true }),
            name: category.name,
            children: category.children.map(mapCategory),
            products: []
        })

        const mapProduct = async (product: FabricProduct): Promise<Product> => {
            let attributes = await getProductAttributes(product.sku)
            const getAttributeValue = name => attributes.find(att => att.name === name).value

            let name = getAttributeValue('title')
            return {
                id: product._id,
                name,
                longDescription: getAttributeValue('description'),
                slug: slugify(name, { lower: true }),
                categories: [],
                variants: [{
                    sku: product.sku,
                    listPrice: '--',
                    salePrice: '--',
                    images: [
                        { url: getAttributeValue('Image 1') },
                        ...JSON.parse(getAttributeValue('ImageArray'))
                    ],
                    attributes: _.zipObject(_.map(attributes, 'name'), _.map(attributes, 'value'))
                }]
            }
        }

        // CommerceAPI implementation
        const getProduct = async function (args: GetCommerceObjectArgs): Promise<Product> {
            return _.first(await getProducts({ productIds: args.id }))
        }

        const getProducts = async function (args: GetProductsArgs): Promise<Product[]> {
            let url = args.productIds ? `/api-product/v1/product/search?size=${args.productIds.split(',').length}&page=1&query=${args.productIds}` : `/api-product/v1/product/search?size=12&page=1&query=${args.keyword}`
            let products = _.get(await fetch(url), 'products')
            return await Promise.all(products.map(mapProduct))
        }

        const getCategory = async function (args: GetCommerceObjectArgs): Promise<Category> {
            let category = findInMegaMenu(await getMegaMenu(args), args.slug)
            return {
                ...category,
                products: await getProductsForCategory(category)
            }
        }

        const getMegaMenu = async function (args: CommonArgs): Promise<Category[]> {
            if (megaMenu) {
                return megaMenu
            }

            // the 'categories[0].children' of the node returned from this URL are the top level categories
            let categories: any[] = _.get(await fetch(`/api-category/v1/category?page=1&size=1&type=ALL`), 'categories[0].children')
            if (categories) {
                return megaMenu = categories.map(mapCategory)
            }

            throw new Error('megaMenu node not found')
        }

        const getCustomerGroups = async function (args: CommonArgs): Promise<CustomerGroup[]> {
            // i think these will live here: https://sandbox.copilot.fabric.inc/api-identity/tags/get
            return []
        }
        // end CommerceAPI implementation

        return {
            getProduct,
            getProducts,
            getCategory,
            getMegaMenu,
            getCustomerGroups
        }
    }
}
export default fabricCodec