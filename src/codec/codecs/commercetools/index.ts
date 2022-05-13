import _ from 'lodash'
import { Codec, CodecStringConfig, StringProperty } from '../../../codec'
import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Product, Variant } from '../../../index'
import { formatMoneyString } from '../../../util'
import OAuthRestClient, { ClientCredentialProperties, ClientCredentialsConfiguration, OAuthCodecConfiguration, OAuthProperties } from '../../../common/rest-client'
import { Attribute, CTCategory, CTProduct, CTVariant, Localizable } from './types'
import { findInMegaMenu } from '../common'

const cats = ['women', 'men', 'new', 'sale', 'accessories']

// caching the categories in CT as recommended here: https://docs.commercetools.com/tutorials/product-modeling/categories#best-practices-categories
let categories: CTCategory[]

type CodecConfig = OAuthCodecConfiguration & ClientCredentialsConfiguration & {
    project:    StringProperty
    scope:      StringProperty
}

const properties: CodecConfig = {
    ...OAuthProperties,
    ...ClientCredentialProperties,
    project: {
        title: "project key",
        type: "string"
    },
    scope: {
        title: "scope",
        type: "string",
        maxLength: 1000
    }
}

const getMapper = (args: GetCommerceObjectArgs): any => {
    args = {
        language: args.language || 'en',
        country: args.country || 'US',
        currency: args.currency || 'USD'
    }

    const findPrice = (variant: CTVariant): string => {
        let price = variant.prices.find(price => price.country === args.country && price.value.currencyCode === args.currency) ||
            variant.prices.find(price => price.value.currencyCode === args.currency) ||
            _.first(variant.prices)

        if (!price) {
            return '--'
        }
        else {
            return formatMoneyString((price.value.centAmount / Math.pow(10, price.value.fractionDigits)), args)
        }
    }

    const mapCategory = (category: CTCategory): Category => ({
        id: category.id,
        name: localize(category.name),
        slug: localize(category.slug),
        children: categories.filter(cat => cat.parent?.id === category.id).map(mapCategory),
        products: []
    })

    const localize = (localizable: Localizable): string => {
        return localizable[args.language] || localizable.en
    }

    const getAttributeValue = (attribute: Attribute): string => {
        if (typeof attribute.value === 'string') {
            return attribute.value
        }
        else if (typeof attribute.value.label === 'string') {
            return attribute.value.label
        }
        else if (attribute.value.label) {
            return localize(attribute.value.label)
        }
        else {
            return localize(attribute.value)
        }
    }

    const mapProduct = (product: CTProduct): Product => ({
        id: product.id,
        name: localize(product.name),
        slug: localize(product.slug),
        variants: _.isEmpty(product.variants) ? [product.masterVariant].map(mapVariant) : product.variants.map(mapVariant),
        categories: []
    })

    const mapVariant = (variant: CTVariant): Variant => ({
        sku: variant.sku,
        images: variant.images,
        listPrice: findPrice(variant),

        // todo: get discounted price
        salePrice: findPrice(variant),
        attributes: _.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(getAttributeValue))
    })

    return {
        findPrice,
        mapCategory,
        localize,
        getAttributeValue,
        mapProduct,
        mapVariant
    }
}

const commerceToolsCodec: Codec = {
    schema: {
        uri: 'https://demostore.amplience.com/site/integration/commercetools',
        icon: 'https://pbs.twimg.com/profile_images/1448061457086640132/zm8zxo8N.jpg',
        properties
    },
    getAPI: function (config: CodecStringConfig<CodecConfig>): CommerceAPI {
        if (!config.scope) {
            return null
        }

        const rest = OAuthRestClient({
            api_url: `${config.api_url}/${config.project}`,
            auth_url: `${config.auth_url}?grant_type=client_credentials`
        },
            {},
            {
                auth: {
                    username: config.client_id,
                    password: config.client_secret
                }
            })
        const fetch = async url => (await rest.get({ url })).results

        const getProductsForCategory = async (categoryId: string): Promise<CTProduct[]> => {
            return await fetch(`/product-projections/search?filter=categories.id: subtree("${categoryId}")`)
        }

        // CommerceAPI implementation
        const getProduct = async (args: GetCommerceObjectArgs): Promise<Product> => {
            if (args.id) {
                let product = _.first(await fetch(`/product-projections/search?filter=id:"${args.id}"`))
                return getMapper(args).mapProduct(product)
            }
            throw new Error(`getProduct(): id must be specified`)
        }

        const getProducts = async (args: GetProductsArgs): Promise<Product[]> => {
            let products: CTProduct[] = []
            if (args.productIds) {
                let queryIds = args.productIds.split(',').map(id => `"${id}"`).join(',')
                products = await fetch(`/product-projections/search?filter=id:${queryIds}`)
            }
            else if (args.keyword) {
                products = await fetch(`/product-projections/search?text.en="${args.keyword}"`)
            }
            return products.map(getMapper(args).mapProduct)
        }

        const getCategory = async (args: GetCommerceObjectArgs): Promise<Category> => {
            let category = findInMegaMenu(await getMegaMenu(args), args.slug)

            // hydrate products into the category
            return {
                ...category,
                products: (await getProductsForCategory(category.id)).map(getMapper(args).mapProduct)
            }
        }

        const getMegaMenu = async (args: CommonArgs): Promise<Category[]> => {
            // for the megaMenu, only get categories that have their slugs in 'cats'
            if (!categories) {
                categories = await fetch(`/categories?limit=500`)
            }
            return categories.filter(cat => cats.includes(cat.slug.en)).map(getMapper(args).mapCategory)
        }

        const getCustomerGroups = async (): Promise<CustomerGroup[]> => {
            return await fetch(`/customer-groups`)
        }
        // end CommerceAPI

        return {
            getProduct,
            getProducts,
            getMegaMenu,
            getCategory,
            getCustomerGroups
        }
    }
}
export default commerceToolsCodec