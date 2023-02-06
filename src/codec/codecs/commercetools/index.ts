import { Category, ClientCredentialProperties, ClientCredentialsConfiguration, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, OAuthRestClient, OAuthRestClientInterface, Product } from '../../../common'
import _ from 'lodash'
import { Dictionary } from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec, registerCodec } from '../../'
import { StringProperty } from '../../cms-property-types'
import { Attribute, CTCategory, CTProduct, CTVariant, Localizable } from './types'
import { formatMoneyString, quoteProductIdString } from '../../../common/util'

const cats = ['women', 'men', 'new', 'sale', 'accessories']

/**
 * TODO
 */
type CodecConfig = ClientCredentialsConfiguration & {
    project: StringProperty
    scope: StringProperty
}

/**
 * TODO
 */
export class CommercetoolsCodecType extends CommerceCodecType {

	/**
	 * TODO
	 */
	get vendor(): string {
		return 'commercetools'
	}

	/**
	 * TODO
	 */
	get properties(): CodecConfig {
		return {
			...ClientCredentialProperties,
			project: {
				title: 'project key',
				type: 'string',
				minLength: 1
			},
			scope: {
				title: 'scope',
				type: 'string',
				maxLength: 1000
			}
		}
	}

	/**
	 * TODO
	 * @param config 
	 * @returns 
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new CommercetoolsCodec(config).init(this)
	}
}

/**
 * TODO
 */
const localize = (localizable: Localizable, args: CommonArgs): string => {
	return localizable[args.language] || localizable.en
}

/**
 * TODO
 * @param args 
 * @returns 
 */
const getAttributeValue = (args: CommonArgs) => (attribute: Attribute): string => {
	if (typeof attribute.value === 'string') {
		return attribute.value
	}
	else if (typeof attribute.value.label === 'string') {
		return attribute.value.label
	}
	else if (attribute.value.label) {
		return localize(attribute.value.label, args)
	}
	else {
		return localize(attribute.value, args)
	}
}

/**
 * TODO
 * @param variant 
 * @param args 
 * @returns 
 */
const findPrice = (variant: CTVariant, args: CommonArgs): string => {
	const price = variant.prices &&
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

/**
 * TODO
 * @param category 
 * @param categories 
 * @param args 
 * @returns 
 */
const mapCategory = (category: CTCategory, categories: CTCategory[], args: CommonArgs): Category => {
	return {
		id: category.id,
		name: localize(category.name, args),
		slug: localize(category.slug, args),
		children: categories.filter(cat => cat.parent?.id === category.id).map(cat => mapCategory(cat, categories, args)),
		products: []
	}
}

/**
 * TODO
 * @param args 
 * @returns 
 */
const mapProduct = (args: CommonArgs) => (product: CTProduct) => {
	return {
		id: product.id,
		name: localize(product.name, args),
		slug: localize(product.slug, args),
		variants: _.isEmpty(product.variants) ? [product.masterVariant].map(mapVariant(args)) : product.variants.map(mapVariant(args)),
		categories: []
	}
}

/**
 * TODO
 * @param args 
 * @returns 
 */
const mapVariant = (args: CommonArgs) => (variant: CTVariant) => {
	return {
		sku: variant.sku,
		images: variant.images,
		listPrice: findPrice(variant, args),

		// todo: get discounted price
		salePrice: findPrice(variant, args),
		attributes: _.zipObject(variant.attributes.map(a => a.name), variant.attributes.map(getAttributeValue(args)))
	}
}

/**
 * TODO
 */
export class CommercetoolsCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>
	rest: OAuthRestClientInterface

	/**
	 * TODO
	 * @param codecType 
	 * @returns 
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		this.rest = OAuthRestClient({
			api_url: `${this.config.api_url}/${this.config.project}`,
			auth_url: `${this.config.auth_url}?grant_type=client_credentials`
		}, {

		}, {
			auth: {
				username: this.config.client_id,
				password: this.config.client_secret
			}
		})
		return await super.init(codecType)
	}

	/**
	 * TODO
	 */
	async cacheMegaMenu(): Promise<void> {
		const categories: CTCategory[] = await this.fetch('/categories?limit=500')
		const mapped: Category[] = categories.map(cat => mapCategory(cat, categories, {}))
		this.megaMenu = mapped.filter(cat => cats.includes(cat.slug))
	}

	/**
	 * TODO
	 * @param url 
	 * @returns 
	 */
	async fetch(url: string) {
		return (await this.rest.get({ url })).results
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		let products: CTProduct[] = []
		if (args.productIds) {
			products = await this.fetch(`/product-projections/search?filter=id:${quoteProductIdString(args.productIds)}`)
		}
		else if (args.keyword) {
			products = await this.fetch(`/product-projections/search?text.en="${args.keyword}"`)
		}
		else if (args.category) {
			products = await this.fetch(`/product-projections/search?filter=categories.id: subtree("${args.category.id}")`)
		}
		return products.map(mapProduct(args))
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return await this.fetch('/customer-groups')
	}
}

export default CommercetoolsCodecType
// registerCodec(new CommercetoolsCodecType())