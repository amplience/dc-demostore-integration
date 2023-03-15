import { 
	APIProperties,
	Category,
	ClientCredentialProperties,
	ClientCredentialsConfiguration,
	CommerceAPI, 
	CommonArgs, 
	GetProductsArgs, 
	Identifiable, 
	Image, 
	Product, 
	Variant
} from '../../../../common'
import _, { Dictionary } from 'lodash'
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../core'
import { getProductsArgError, logResponse } from '../../common'
import { StringProperty } from '../../../cms-property-types'
import axios, { AxiosInstance } from 'axios'
import { catchAxiosErrors } from '../../codec-error'
import { formatMoneyString } from '../../../../common/util'

/**
 * Shopify codec configuration.
 */
type CodecConfig = {
	access_token: StringProperty,
	version: StringProperty,
	site_id: StringProperty
}

interface GqlResponse<T> {
	data: T
}

interface Edge<T> {
	node: T,
	cursor: string
}

interface Paginated<T> {
	edges: Edge<T>[]
}

interface ShopifyCollectionMinimal {
	id: string,
	handle: string,
	title: string
}

interface ShopifyPrice {
	currencyCode: string,
	amount: string
}

interface ShopifyImage {
	id: string,
	url: string,
	altText: string
}

interface ShopifyVariant {
	id: string,
	title: string,
	sku: string,
	selectedOptions: {name: string, value: string}[],
	price: ShopifyPrice,
	unitPrice?: ShopifyPrice,
	compareAtPrice?: ShopifyPrice,
	image: ShopifyImage
}

interface ShopifyProduct {
	id: string,
	title: string,
	handle: string,
	description: string,
	collections: Paginated<ShopifyCollectionMinimal>,
	tags: string[],
	variants: Paginated<ShopifyVariant>,
	images: Paginated<ShopifyImage>,
	availableForSale: boolean
}

interface ShopifyProductsByQuery {
	products: Paginated<ShopifyProduct>
}

interface ShopifyProductByID {
	product: ShopifyProduct
}

interface ShopifyProductsByCategory {
	category: {
		products: Paginated<ShopifyProduct>
	}
}

const productShared = `
id
title
description
collections(first: 100) {
  edges {
	node {
	  id
	  handle
	  title
	}
	cursor
  }
}
tags
variants(first: 100) {
  edges {
	node {
	  id
	  title
	  sku
	  selectedOptions {
		name
		value
	  }
	  price {
		currencyCode
		amount
	  }
	  unitPrice {
		currencyCode
		amount
	  },
	  compareAtPrice {
		currencyCode
		amount
	  }
	  image {
		id
		url
		altText
	  }
	}
	cursor
  }
}
images(first: 100) {
  edges {
	node {
	  id
	  url
	  altText
	}
	cursor
  }
}
availableForSale
handle`

const productsByQuery = `
query getProducts($pageSize: Int!, $query: String, $after: String){
  products(first: $pageSize, after: $after, query: $query) {
    edges {
      node {
${productShared}
      }
      cursor
    }
  }
}`

const productById = `
query getProductById($id: ID!) {
	product(id: $id) {
${productShared}
	}
}`

const productsByCategory = `
query getProductsByCategory($handle: String!, $pageSize: Int!, $after: String) {
  collection(handle: $handle) {
    products(first: $pageSize, after: $after) {
      edges {
        node {
${productShared}
        }
        cursor
      }
    }
  }
}`

/**
 * A template commerce codec type, useful as a starting point for a new integration.
 */
export class ShopifyCommerceCodecType extends CommerceCodecType {

	/**
	 * @inheritdoc
	 */
	get vendor(): string {
		return 'shopify'
	}

	/**
	 * @inheritdoc
	 */
	get properties(): CodecConfig {
		return {
			access_token:  {
				title: 'access token',
				type: 'string',
				minLength: 1
			},
			version:  {
				title: 'version',
				type: 'string',
				minLength: 1
			},
			site_id:  {
				title: 'site id',
				type: 'string',
				minLength: 1
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
		return await new ShopifyCommerceCodec(config).init(this)
	}
}

/**
 * A template commerce codec, useful as a starting point for a new integration.
 */
export class ShopifyCommerceCodec extends CommerceCodec {
	declare config: CodecPropertyConfig<CodecConfig>
	apiClient: AxiosInstance

	// instance variables
	// products: Product[]
	// categories: Category[]

	/**
	 * @inheritdoc
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		this.apiClient = axios.create({
			baseURL: `https://${this.config.site_id}.myshopify.com/api/${this.config.version}`,
			headers: {
				'X-Shopify-Storefront-Access-Token': this.config.access_token
			}
		})

		// this.products = await fetchFromURL(this.config.productURL, [])
		// this.megaMenu = this.categories.filter(cat => !cat.parent)
		return await super.init(codecType)
	}

	async gqlRequest<T>(query: string, variables: any): Promise<T> {
		const url = 'graphql.json'
		const result: GqlResponse<T> = await logResponse('get', url, (await catchAxiosErrors(async () =>
			await this.apiClient.post(url, {
				query,
				variables
			})
		)).data)

		return result.data
	}

	async getProductById(id: string): Promise<ShopifyProduct> {
		return (await this.gqlRequest<ShopifyProductByID>(productById, { id })).product
	}

	async getProductsByKeyword(keyword: string): Promise<ShopifyProduct[]> {
		// TODO: pagination
		const query = keyword
		const pageSize = 100
		const result = await this.gqlRequest<ShopifyProductsByQuery>(productsByQuery, {query, pageSize})

		return result.products.edges.map(edge => edge.node)
	}

	async getProductsByCategory(keyword: string): Promise<ShopifyProduct[]> {
		// TODO: pagination
		const query = keyword
		const pageSize = 100
		const result = await this.gqlRequest<ShopifyProductsByCategory>(productsByCategory, {query, pageSize})

		return result.category.products.edges.map(edge => edge.node)
	}

	firstNonEmpty(strings: string[]) {
		return strings.find(string => string !== '' && string != null)
	}

	mapPrice(price: ShopifyPrice): string {
		return formatMoneyString(price.amount, { currency: price.currencyCode })
	}

	mapCategoryMinimal(collection: ShopifyCollectionMinimal): Category {
		return {
			id: collection.id,
			slug: collection.handle,
			name: collection.title,
			children: [],
			products: []
		}
	}

	mapVariant(variant: ShopifyVariant, sharedImages: ShopifyImage[]): Variant {
		const attributes: Dictionary<string> = {}

		for (const option of variant.selectedOptions) {
			attributes[option.name] = option.value
		}
		
		return {
			sku: this.firstNonEmpty([variant.sku, variant.id]),
			listPrice: this.mapPrice(variant.price ?? variant.unitPrice),
			salePrice: this.mapPrice(variant.compareAtPrice ?? variant.price ?? variant.unitPrice),
			attributes: attributes,
			images: [variant.image, ...sharedImages]
		}
	}

	mapProduct(product: ShopifyProduct): Product {
		const sharedImages = product.images.edges.filter(image => 
			product.variants.edges.findIndex(variant => variant.node.image.id === image.node.id) === -1
		).map(edge => edge.node)

		return {
			id: product.id,
			name: product.title,
			slug: product.handle,
			categories: product.collections.edges.map(collection => this.mapCategoryMinimal(collection.node)),
			variants: product.variants.edges.map(variant => this.mapVariant(variant.node, sharedImages)),
			shortDescription: product.description,
			longDescription: product.description
		}
	}

	/**
	 * @inheritdoc
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		return (await this.getRawProducts(args)).map(product => this.mapProduct(product))
	}

	/**
	 * @inheritdoc
	 */
	async getRawProducts(args: GetProductsArgs): Promise<ShopifyProduct[]> {
		let products: ShopifyProduct[] = []

		// eslint-disable-next-line no-empty
		if (args.productIds) {
			products = await Promise.all(
				args.productIds.split(',').map(this.getProductById.bind(this))
			)
		}
		// eslint-disable-next-line no-empty
		else if (args.keyword) {
			products = await this.getProductsByKeyword(args.keyword)
		}
		// eslint-disable-next-line no-empty
		else if (args.category) {
			products = await this.getProductsByCategory(args.category.slug)
		}
		else {
			throw getProductsArgError('getRawProducts')
		}

		return products
	}

	/**
	 * @inheritdoc
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		return []
	}
}

export default ShopifyCommerceCodecType
// registerCodec(new ShopifyCommerceCodecType())