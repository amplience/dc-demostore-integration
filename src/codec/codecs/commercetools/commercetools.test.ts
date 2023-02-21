import { Request, MockFixture, massMock, MockRequests } from '../../../common/test/rest-mock'
import axios from 'axios'
import { CommerceCodec } from '../core'
import CommercetoolsCodecType, { CommercetoolsCodec } from '.'
import { ctoolsCategories } from './test/responses'

jest.mock('axios')

const commerceRequests: MockFixture = {
	get: {
		'https://api.europe-west1.gcp.commercetools.com/categories?offset=0&limit=500': {
			data: ctoolsCategories
		}
	},
	post: {
		'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials': {
			data: {
				access_token: 'token',
				token_type: 'Bearer',
				expires_in: 172775,
				scope: 'view_discount_codes:test view_categories:test view_cart_discounts:test view_customers:test view_product_selections:test view_published_products:test view_customer_groups:test view_products:test'
			}
		}
	}
}

const config : any = {
	vendor: 'commercetools',
	project: 'test',
	client_id: 'test_client',
	client_secret: 'test_secret',
	auth_url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
	api_url: 'https://api.europe-west1.gcp.commercetools.com',
	scope: 'view_published_products:test view_product_selections:test view_discount_codes:test view_categories:test view_cart_discounts:test view_customers:test view_product_selections:test view_customer_groups:test view_products:test'
}

const oauthRequest = {
	config: {
		url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials'
	},
	url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials'
}

const categoriesRequest = {
	config: {
		baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
		headers: {
			Authorization: 'Bearer token',
		},
		method: 'GET',
		url: '/categories?offset=0&limit=500',
	},
	url: 'https://api.europe-west1.gcp.commercetools.com/categories?offset=0&limit=500'
}

const productIdRequest = (id: string) => ({
	// Returns request made to fetch a given product ID
})

const productIdRequests = (id: string, total: number) => Array.from({length: total}).map((_, index) => productIdRequest(id + index))

const exampleProduct = (id: string) => ({
	// Common representation of the product
})

const rawProduct = (id: string) => ({
	// Codec specific representation of the product
})

describe('commercetools integration', function() {
	let codec: CommerceCodec
	let requests: Request[]

	beforeEach(async () => {
		jest.resetAllMocks()

		requests = []

		massMock(axios, requests, commerceRequests)

		codec = new CommercetoolsCodec(config)
		await codec.init(new CommercetoolsCodecType())
	})

	test('getProduct', async () => {
		const result = await codec.getProduct({
			id: 'ExampleID'
		})

		expect(requests).toEqual([
			oauthRequest,
			productIdRequest('ExampleID')
		])

		expect(result).toEqual(exampleProduct('ExampleID'))
	})


	test('getProducts (multiple)', async () => {
		const result = await codec.getProducts({
			productIds: 'ExampleID,ExampleID2'
		})

		expect(requests).toEqual([
			oauthRequest,
			productIdRequest('ExampleID'),
			productIdRequest('ExampleID2')
		])

		expect(result).toEqual([
			exampleProduct('ExampleID'),
			exampleProduct('ExampleID2')
		])
	})

	test('getProducts (keyword)', async () => {
		const result = await codec.getProducts({
			keyword: 'Hit'
		})

		expect(requests).toEqual([
			oauthRequest,
			productIdRequest('ExampleID'),
			productIdRequest('ExampleID2')
		])

		expect(result).toEqual([
			exampleProduct('ExampleID'),
			exampleProduct('ExampleID2')
		])
	})

	test('getProducts (category)', async () => {
		const products = await codec.getProducts({ category: {
			children: [],
			products: [],
			id: 'newarrivals-womens',
			name: 'Womens',
			slug: 'newarrivals-womens',
		}})

		expect(requests).toEqual([
			oauthRequest,
			productIdRequests('Hit', 300)
		])

		expect(products.length).toEqual(300)

		expect(products).toEqual(Array.from({length: 300}).map((_, index) => exampleProduct('Hit' + index)))
	})

	test('getProduct (missing)', async () => {
		expect(codec.getProduct({
			id: 'MissingID'
		})).rejects.toMatchInlineSnapshot()

		expect(requests).toEqual([
			oauthRequest,
			productIdRequest('MissingID')
		])
	})

	test('getRawProducts', async () => {
		const result = await codec.getRawProducts({
			productIds: 'ExampleID'
		})

		expect(requests).toEqual([
			oauthRequest,
			productIdRequest('ExampleID')
		])

		expect(result).toEqual([rawProduct('ExampleID')])
	})

	test('getCategory', async () => {
		const category = await codec.getCategory({ slug: 'newarrivals-womens' })

		expect(requests).toEqual([
			oauthRequest,
			productIdRequests('Hit', 300)
		])

		expect(category.products.length).toEqual(300)

		expect(category).toEqual({
			children: [],
			products: Array.from({length: 300}).map((_, index) => exampleProduct('Hit' + index)),
			id: 'newarrivals-womens',
			name: 'Womens',
			slug: 'newarrivals-womens',
		})
	})

	test('getMegaMenu', async () => {
		const megaMenu = await codec.getMegaMenu({})

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest
		])

		expect(megaMenu).toMatchInlineSnapshot(`
[
  {
    "children": [],
    "id": "men-id",
    "name": "Men",
    "products": [],
    "slug": "men",
  },
]
`)
	})

	test('getCustomerGroups', async () => {
		const customerGroups = await codec.getCustomerGroups({})

		expect(customerGroups).toMatchInlineSnapshot()

		expect(requests).toEqual([
			oauthRequest
		])
	})
})