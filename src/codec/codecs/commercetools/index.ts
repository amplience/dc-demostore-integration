import _ from 'lodash'
import { Codec, CommerceCodec, registerCodec } from '../../../codec'
import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetCommerceObjectArgs, GetProductsArgs, Product, Variant } from '../../../index'
import { formatMoneyString } from '../../../util'
import OAuthRestClient, { OAuthRestClientInterface } from '../../../common/rest-client'
import { Attribute, CommerceToolsCodecConfiguration, CTCategory, CTProduct, CTVariant, Localizable } from './types'

const cats = ['women', 'men', 'new', 'sale', 'accessories']

// caching the categories in CT as recommended here: https://docs.commercetools.com/tutorials/product-modeling/categories#best-practices-categories
let categories: CTCategory[]

const getMapper = (args: GetCommerceObjectArgs): any => {
    args = {
        language: args.language || 'en',
        country: args.country || 'US',
        currency: args.currency || 'USD'
    }
    
    const map = () => getMapper(args)
    return {
        findPrice: (variant: CTVariant): string => {
            let price = variant.prices.find(price => price.country === args.country && price.value.currencyCode === args.currency) ||
                variant.prices.find(price => price.value.currencyCode === args.currency) ||
                _.first(variant.prices)

            return formatMoneyString((price.value.centAmount / Math.pow(10, price.value.fractionDigits)), args)
        },

        mapCategory: (category: CTCategory): Category => ({
            id: category.id,
            name: map().localize(category.name),
            slug: map().localize(category.slug),
            children: categories.filter(cat => cat.parent?.id === category.id).map(map().mapCategory),
            products: []
        }),

        localize: (localizable: Localizable): string => {
            return localizable[args.language] || localizable.en
        },

        getAttributeValue: (attribute: Attribute): string => {
            if (typeof attribute.value === 'string') {
                return attribute.value
            }
            else if (typeof attribute.value.label === 'string') {
                return attribute.value.label
            }
            else if (attribute.value.label) {
                return map().localize(attribute.value.label)
            }
            else {
                return map().localize(attribute.value)
            }
        },

        mapProduct: (product: CTProduct): Product => ({
            ...product,
            name: map().localize(product.name),
            slug: map().localize(product.slug),
            variants: _.isEmpty(product.variants) ? [product.masterVariant].map(map().mapVariant) : product.variants.map(map().mapVariant),
            categories: []
        }),

        mapVariant: (variant: CTVariant): Variant => ({
            ...variant,
            listPrice: map().findPrice(variant),

            // todo: get discounted price
            salePrice: map().findPrice(variant),
            attributes: _.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(map().getAttributeValue))
        })
    }
}

const commerceToolsCodec: CommerceCodec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/commercetools',
    getAPI: function (config: CommerceToolsCodecConfiguration): CommerceAPI {
        let rest = OAuthRestClient({
            ...config,
            api_url: `${config.api_url}/${config.project}`
        }, {
            grant_type: 'client_credentials'
        }, {
            auth: {
                username: config.client_id,
                password: config.client_secret
            }
        })

        const api: any = {
            getProduct: async (args: GetCommerceObjectArgs): Promise<CTProduct> => {
                if (args.id) {
                    return _.first((await rest.get({ url: `/product-projections/search?filter=id:"${args.id}"` })).results)
                }
                throw new Error(`getProduct(): id must be specified`)
            },
            getProducts: async (args: GetProductsArgs): Promise<CTProduct[]> => {
                if (args.productIds) {
                    let queryIds = args.productIds.split(',').map(id => `"${id}"`).join(',')
                    return (await rest.get({ url: `/product-projections/search?filter=id:${queryIds}` })).results
                }
                else if (args.keyword) {
                    return (await rest.get({ url: `/product-projections/search?text.en="${args.keyword}"` })).results
                }
                throw new Error(`getProducts(): productIds or keyword must be specified`)
            },
            getCategories: async function (): Promise<CTCategory[]> {
                if (!categories) {
                    categories = (await rest.get({ url: `/categories?limit=500` })).results
                }
                return categories
            },
            getCategory: async (args: GetCommerceObjectArgs): Promise<CTCategory> => {
                return (await api.getCategories()).find(cat => cat.slug.en === args.slug)
            },
            getProductsForCategory: async (category: Category): Promise<CTProduct[]> => {
                return (await rest.get({ url: `/product-projections/search?filter=categories.id: subtree("${category.id}")` })).results
            }
        }
        
        return {
            getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
                return getMapper(args).mapProduct(await api.getProduct(args))
            },
            getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
                return (await api.getProducts(args)).map(getMapper(args).mapProduct)
            },
            getCategory: async (args: GetCommerceObjectArgs): Promise<Category> => {
                let category = getMapper(args).mapCategory(await api.getCategory(args))

                // hydrate products into the category
                return {
                    ...category,
                    products: (await api.getProductsForCategory(category)).map(getMapper(args).mapProduct)
                }
            },
            getMegaMenu: async (args: CommonArgs): Promise<Category[]> => {
                // for the megaMenu, only get categories that have their slugs in 'cats'
                let categories = (await api.getCategories()).filter(cat => cats.includes(cat.slug.en))
                return categories.map(getMapper(args).mapCategory)
            },
            getCustomerGroups: async (args: CommonArgs): Promise<CustomerGroup[]> => {
                return []
            }
        }
    },
    canUseConfiguration: function (config: any): boolean {
        return config.project && config.client_id && config.client_secret && config.auth_url && config.api_url && config.scope
    }
}

export default commerceToolsCodec
registerCodec(commerceToolsCodec)