import SFCCCommerceCodecType, { SFCCCommerceCodec } from '.'
import { Request, MockFixture, massMock } from '../../../../common/test/rest-mock'
import axios from 'axios'
import { sfccCategories, sfccCustomerGroups, sfccProduct, sfccProducts, sfccSearchResult } from './test/responses'
import { categoryRequest, categorySearch, customerGroupsRequest, keywordSearch, oauthRequest, productIdRequest, productIdRequests } from './test/requests'
import { exampleCustomerGroups, exampleCategoryTree, exampleProduct } from './test/results'
import { config } from './test/config'
import { flattenConfig } from '../../../../common/util'

jest.mock('axios')

const sfccRequests: MockFixture = {
	get: {
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/categories/root': {
			data: sfccCategories
		},
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/ExampleID': {
			data: sfccProduct('ExampleID')
		},
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/ExampleID2': {
			data: sfccProduct('ExampleID2')
		},
		...sfccProducts('Hit', 300),
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=0&count=200': {
			data: sfccSearchResult(300, 200, 0, 'newarrivals-womens')
		},
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=200&count=200': {
			data: sfccSearchResult(300, 200, 1, 'newarrivals-womens')
		},
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=0&count=200': {
			data: sfccSearchResult(300, 200, 0, 'Hit')
		},
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=200&count=200': {
			data: sfccSearchResult(300, 200, 1, 'Hit')
		},
		'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000': {
			data: sfccCustomerGroups
		}
	},
	post: {
		'https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials': {
			data: {
				access_token: 'token',
				scope: 'mail tenantFilter profile',
				token_type: 'Bearer',
				expires_in: 1799
			}
		}
	}
}

describe('sfcc integration', function() {
	let sfccCodec: SFCCCommerceCodec
	let requests: Request[]

	beforeEach(async () => {
		jest.resetAllMocks()

		requests = []

		massMock(axios, requests, sfccRequests)

		sfccCodec = new SFCCCommerceCodec(flattenConfig(config))
		await sfccCodec.init(new SFCCCommerceCodecType())
	})

	test('getProduct', async () => {
		const result = await sfccCodec.getProduct({
			id: 'ExampleID'
		})

		expect(requests).toEqual([
			productIdRequest('ExampleID')
		])

		expect(result).toEqual(exampleProduct('ExampleID'))
	})


	test('getProducts (multiple)', async () => {
		const result = await sfccCodec.getProducts({
			productIds: 'ExampleID,ExampleID2'
		})

		expect(requests).toEqual([
			productIdRequest('ExampleID'),
			productIdRequest('ExampleID2')
		])

		expect(result).toEqual([
			exampleProduct('ExampleID'),
			exampleProduct('ExampleID2')
		])
	})

	test('getProducts (keyword)', async () => {
		const products = await sfccCodec.getProducts({
			keyword: 'Hit'
		})

		expect(requests).toEqual([
			keywordSearch(0),
			keywordSearch(200),
			...productIdRequests('Hit', 300)
		])

		expect(products.length).toEqual(300)

		expect(products).toEqual(Array.from({length: 300}).map((_, index) => exampleProduct('Hit' + index)))
	})

	test('getProducts (category)', async () => {
		const products = await sfccCodec.getProducts({ category: {
			children: [],
			products: [],
			id: 'newarrivals-womens',
			name: 'Womens',
			slug: 'newarrivals-womens',
		}})

		expect(requests).toEqual([
			categorySearch(0),
			categorySearch(200),
			...productIdRequests('Hit', 300)
		])

		expect(products.length).toEqual(300)

		expect(products).toEqual(Array.from({length: 300}).map((_, index) => exampleProduct('Hit' + index)))
	})

	test('getProduct (missing)', async () => {
		const result = await sfccCodec.getProduct({
			id: 'MissingID'
		})

		expect(result).toBeNull()

		expect(requests).toEqual([
			productIdRequest('MissingID')
		])
	})

	test('getProducts (multiple, one missing)', async () => {
		const result = await sfccCodec.getProducts({
			productIds: 'ExampleID,NotHere,ExampleID2'
		})

		expect(requests).toEqual([
			productIdRequest('ExampleID'),
			productIdRequest('NotHere'),
			productIdRequest('ExampleID2')
		])

		expect(result).toEqual([
			exampleProduct('ExampleID'),
			null,
			exampleProduct('ExampleID2')
		])
	})

	test('getRawProducts', async () => {
		const result = await sfccCodec.getRawProducts({
			productIds: 'ExampleID'
		})

		expect(requests).toEqual([
			productIdRequest('ExampleID')
		])

		expect(result).toEqual([sfccProduct('ExampleID')])
	})

	test('getRawProducts (one missing)', async () => {
		const result = await sfccCodec.getRawProducts({
			productIds: 'ExampleID,NotHere,ExampleID2'
		})

		expect(requests).toEqual([
			productIdRequest('ExampleID'),
			productIdRequest('NotHere'),
			productIdRequest('ExampleID2')
		])

		expect(result).toEqual([
			sfccProduct('ExampleID'),
			null,
			sfccProduct('ExampleID2')
		])
	})

	test('getCategory', async () => {
		const category = await sfccCodec.getCategory({ slug: 'newarrivals-womens' })

		expect(requests).toEqual([
			categoryRequest,
			categorySearch(0),
			categorySearch(200),
			...productIdRequests('Hit', 300)
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

	test('getCategoryTree', async () => {
		const categoryTree = await sfccCodec.getCategoryTree({})

		expect(requests).toEqual([
			categoryRequest,
		])

		expect(categoryTree).toEqual(exampleCategoryTree)
	})

	test('getCustomerGroups', async () => {
		const customerGroups = await sfccCodec.getCustomerGroups({})

		expect(customerGroups).toEqual(exampleCustomerGroups)

		expect(requests).toEqual([
			oauthRequest,
			customerGroupsRequest
		])
	})
})