import { Request, MockFixture, massMock } from '../../../common/test/rest-mock'
import axios from 'axios'
import { CommerceCodec } from '../core'
import CommercetoolsCodecType, { CommercetoolsCodec } from '.'
import { ctoolsCategories, ctoolsCustomerGroups, ctoolsSearchResult } from './test/responses'
import { exampleCustomerGroups, exampleMegaMenu, exampleProduct } from './test/results'
import { categoriesRequest, customerGroupsRequest, oauthRequest, searchRequest } from './test/requests'
import { config } from './test/config'

jest.mock('axios')

const commerceRequests: MockFixture = {
	get: {
		'https://api.europe-west1.gcp.commercetools.com/test/categories?offset=0&limit=500': {
			data: ctoolsCategories
		},
		'https://api.europe-west1.gcp.commercetools.com/test/customer-groups?offset=0&limit=20': {
			data: ctoolsCustomerGroups
		},
		'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=id%3A%22ExampleID%22&offset=0&limit=20': {
			data: ctoolsSearchResult(1, 20, 0, ['ExampleID'])
		},
		'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=id%3A%22ExampleID%22%2C%22ExampleID2%22&offset=0&limit=20': {
			data: ctoolsSearchResult(2, 20, 0, ['ExampleID', 'ExampleID2'])
		},
		'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?text.en=%22Hit%22&offset=0&limit=20': {
			data: ctoolsSearchResult(30, 20, 0)
		},
		'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?text.en=%22Hit%22&offset=20&limit=20': {
			data: ctoolsSearchResult(30, 20, 1)
		},
		'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20': {
			data: ctoolsSearchResult(30, 20, 0)
		},
		'https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20': {
			data: ctoolsSearchResult(30, 20, 1)
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
			categoriesRequest,
			searchRequest('filter=id%3A%22ExampleID%22&offset=0&limit=20')
		])

		expect(result).toEqual(exampleProduct('ExampleID'))
	})


	test('getProducts (multiple)', async () => {
		const result = await codec.getProducts({
			productIds: 'ExampleID,ExampleID2'
		})

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest,
			searchRequest('filter=id%3A%22ExampleID%22%2C%22ExampleID2%22&offset=0&limit=20')
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
			categoriesRequest,
			searchRequest('text.en=%22Hit%22&offset=0&limit=20'),
			searchRequest('text.en=%22Hit%22&offset=20&limit=20')
		])

		expect(result).toEqual(Array.from({length: 30}).map((_, index) => exampleProduct('Hit' + index)))
	})

	test('getProducts (category)', async () => {
		const products = await codec.getProducts({ category: {
			children: [],
			products: [],
			id: 'men-id',
			name: 'Men',
			slug: 'men',
		}})

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest,
			searchRequest('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20'),
			searchRequest('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20')
		])

		expect(products.length).toEqual(30)

		expect(products).toEqual(Array.from({length: 30}).map((_, index) => exampleProduct('Hit' + index)))
	})

	test('getProduct (missing)', async () => {
		await expect(codec.getProduct({
			id: 'MissingID'
		})).resolves.toBeUndefined()

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest,
			searchRequest('filter=id%3A%22MissingID%22&offset=0&limit=20')
		])
	})

	test('getRawProducts', async () => {
		const result = await codec.getRawProducts({
			productIds: 'ExampleID'
		})

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest
		])

		expect(result).toEqual([])
	})

	test('getCategory', async () => {
		const category = await codec.getCategory({ slug: 'men' })

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest,
			searchRequest('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20'),
			searchRequest('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20')
		])

		expect(category.products.length).toEqual(30)

		expect(category).toEqual({
			children: [],
			products: Array.from({length: 30}).map((_, index) => exampleProduct('Hit' + index)),
			id: 'men-id',
			name: 'Men',
			slug: 'men',
		})
	})

	test('getMegaMenu', async () => {
		const megaMenu = await codec.getMegaMenu({})

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest
		])

		expect(megaMenu).toEqual(exampleMegaMenu)
	})

	test('getCustomerGroups', async () => {
		const customerGroups = await codec.getCustomerGroups({})

		expect(customerGroups).toEqual(exampleCustomerGroups)

		expect(requests).toEqual([
			oauthRequest,
			categoriesRequest,
			customerGroupsRequest
		])
	})
})