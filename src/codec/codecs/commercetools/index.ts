import _ from 'lodash'
import { CodecPropertyConfig, CodecType, CommerceCodec, registerCodec, StringProperty } from '../..'
import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Product, Variant } from '../../../index'
import { formatMoneyString } from '../../../common/util'
import OAuthRestClient, { ClientCredentialProperties, ClientCredentialsConfiguration } from '../../../common/rest-client'
import { Attribute, CTCategory, CTProduct, CTVariant, Localizable } from './types'

const cats = ['women', 'men', 'new', 'sale', 'accessories']
const quote = (str: string) => `"${str}"`

type CodecConfig = ClientCredentialsConfiguration & {
    project: StringProperty
    scope: StringProperty
}

const commerceToolsCodec: CommerceCodec = {
    metadata: {
        type: CodecType.commerce,
        vendor: 'commercetools',
        properties: {
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
    },
    getAPI: async (config: CodecPropertyConfig<CodecConfig>): Promise<Partial<CommerceAPI>> => {
        const rest = OAuthRestClient({
            api_url: `${config.api_url}/${config.project}`,
            auth_url: `${config.auth_url}?grant_type=client_credentials`
        }, {

        }, {
            auth: {
                username: config.client_id,
                password: config.client_secret
            }
        })
        const fetch = async url => (await rest.get({ url })).results

        // caching the categories in CT as recommended here: https://docs.commercetools.com/tutorials/product-modeling/categories#best-practices-categories
        const categories: CTCategory[] = await fetch(`/categories?limit=500`)

        const getMapper = (args: GetCommerceObjectArgs): any => {
            const findPrice = (variant: CTVariant): string => {
                let price = variant.prices &&
                    (variant.prices.find(price => price.country === args.country && price.value.currencyCode === args.currency) ||
                        variant.prices.find(price => price.value.currencyCode === args.currency) ||
                        _.first(variant.prices))

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

            const mapVariant = (variant: CTVariant): Variant => {
                return {
                    sku: variant.sku,
                    images: variant.images,
                    listPrice: findPrice(variant),

                    // todo: get discounted price
                    salePrice: findPrice(variant),
                    attributes: _.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(getAttributeValue))
                }
            }

            return {
                findPrice,
                mapCategory,
                localize,
                getAttributeValue,
                mapProduct,
                mapVariant
            }
        }

        // CommerceAPI implementation
        const getProduct = async (args: GetCommerceObjectArgs): Promise<Product> => {
            return _.first(await getProducts({ ...args, productIds: args.id }))
        }

        const getProducts = async (args: GetProductsArgs): Promise<Product[]> => {
            let products: CTProduct[] = []
            if (args.productIds) {
                let queryIds = args.productIds.split(',').map(quote).join(',')
                products = await fetch(`/product-projections/search?filter=id:${queryIds}`)
            }
            else if (args.keyword) {
                products = await fetch(`/product-projections/search?text.en="${args.keyword}"`)
            }
            else if (args.category) {
                products = await fetch(`/product-projections/search?filter=categories.id: subtree("${args.category.id}")`)
            }
            return products.map(getMapper(args).mapProduct)
        }

        const getMegaMenu = async (args: CommonArgs): Promise<Category[]> => {
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
            getCustomerGroups
        }
    }
}
registerCodec(commerceToolsCodec)