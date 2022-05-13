import _ from 'lodash'
import { Product, Category, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, CommonArgs } from '../../../types'
import { Codec, CodecStringConfig, StringProperty } from '../..'
import { CommerceAPI } from '../../..'
import OAuthRestClient, { OAuthCodecConfiguration, OAuthProperties } from '../../../common/rest-client'
import slugify from 'slugify'
import { findInMegaMenu } from '../common'
import { Attribute, FabricCategory, FabricProduct } from './types'

let megaMenu: Category[]

type CodecConfig = OAuthCodecConfiguration & {
    username:   StringProperty
    password:   StringProperty
    accountId:  StringProperty
    accountKey: StringProperty
    stage:      StringProperty
}

const properties: CodecConfig = {
    ...OAuthProperties,
    username: {
        title: "Username",
        type: "string"
    },
    password: {
        title: "Password",
        type: "string"
    },
    accountId: {
        title: "Account ID",
        type: "string"
    },
    accountKey: {
        title: "Account Key",
        type: "string"
    },
    stage: {
        title: "Stage",
        type: "string"
    }
}

const fabricCodec: Codec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/fabric',
        icon: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/qhb7eb9tdr9qf2xzy8w5',
        properties
    },
    getAPI: function (config: CodecStringConfig<CodecConfig>): CommerceAPI {
        if (!config.username) {
            return null
        }

        const rest = OAuthRestClient(config, {
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
                // todo: what do we need to remove (abstract) from here?  account?  stage?
                'x-site-context': JSON.stringify({
                    stage: config.stage,
                    account: config.accountKey,
                    date: new Date().toISOString(),
                    channel: 12
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