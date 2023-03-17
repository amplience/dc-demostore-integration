import { Request, MockFixture, massMock, dataToResponse } from '../../../../common/test/rest-mock'
import axios from 'axios'
import { CommerceCodec } from '../../core'
import ShopifyCodecType, { ShopifyCommerceCodec } from '.'
import { 
	shopifyCategories, 
	shopifySegments, 
	shopifyProduct, 
	shopifyProductsByKeyword, 
	shopifyCategoryProducts 
} from './test/responses'
import { 
	exampleCategoryProducts, 
	exampleCustomerGroups, 
	exampleMegaMenu, 
	exampleProduct, 
	exampleProductsByKeyword 
} from './test/results'
import { 
	collectionsRequest, 
	segmentsRequest, 
	productRequest, 
	productsByKeywordRequest, 
	productsByCategoryRequest 
} from './test/requests'
import { config } from './test/config'
import { flattenConfig } from '../../../../common/util'

jest.mock('axios')

const commerceProductRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/api/version/graphql.json': dataToResponse([
			{
				data: productRequest('ExampleID').config.data,
				response: {
					data: shopifyProduct('ExampleID')
				}
			},
			{
				data: productRequest('ExampleID2').config.data,
				response: {
					data: shopifyProduct('ExampleID2')
				}
			},
			{
				data: productRequest('MissingID').config.data,
				response: {
					data: {
						data: {
							product: null
						}
					}
				}
			}
		])
	}
}

const commerceProductMissingRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/api/version/graphql.json': {
			data: {
				data: {
					product: null
				}
			}
		}
	}
}

const commerceProductsByKeywordRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/api/version/graphql.json': {
			data: shopifyProductsByKeyword
		}
	}
}

const commerceProductsByCategoryRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/api/version/graphql.json': dataToResponse([
			{
				data: collectionsRequest.config.data,
				response: {
					data: shopifyCategories
				}
			},
			{
				data: productsByCategoryRequest.config.data,
				response: {
					data: shopifyCategoryProducts
				}
			}
		])
	}
}

const commerceSegmentsRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/admin/api/version/graphql.json': {
			data: shopifySegments
		}
	}
}

const commerceCollectionsRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/api/version/graphql.json': {
			data: shopifyCategories
		}
	}
}

describe('shopify integration', function () {
	let codec: CommerceCodec
	let requests: Request[]

	beforeEach(async () => {
		jest.resetAllMocks()
		requests = []
	})

	test('getProduct (by id)', async () => {

		// Setup with the right fixture
		massMock(axios, requests, commerceProductRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const result = await codec.getProduct({ id: 'ExampleID' })
		expect(result).toEqual(exampleProduct('ExampleID'))
		expect(requests).toEqual([
			productRequest('ExampleID')
		])
	})

	test('getProducts (multiple)', async () => {

		// Setup with the right fixture
		massMock(axios, requests, commerceProductRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const result = await codec.getProducts({
			productIds: 'ExampleID,ExampleID2'
		})

		expect(requests).toEqual([
			productRequest('ExampleID'),
			productRequest('ExampleID2')
		])

		expect(result).toEqual([
			exampleProduct('ExampleID'),
			exampleProduct('ExampleID2')
		])
	})

	test('getProducts (keyword)', async () => {

		// Setup with the right fixture
		massMock(axios, requests, commerceProductsByKeywordRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const categories = await codec.getProducts({ keyword: 'fulfilled' })
		expect(categories).toEqual(exampleProductsByKeyword)
		expect(requests).toEqual([
			productsByKeywordRequest
		])
	})

	test('getProducts (category)', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceProductsByCategoryRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const products = await codec.getProducts({
			category: {
				id: 'gid://shopify/Collection/439038837024',
				slug: 'hydrogen',
				name: 'Hydrogen',
				image: null,
				children: [],
				products: []
			}
		})

		expect(products).toEqual(exampleCategoryProducts.products)

		expect(requests).toEqual([
			productsByCategoryRequest
		])
	})

	test('getProduct (missing)', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceProductMissingRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const result = await codec.getProduct({ id: 'MissingID' })
		expect(result).toBeNull()
		expect(requests).toEqual([
			productRequest('MissingID')
		])
	})

	test('getProducts (multiple, one missing)', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceProductRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const result = await codec.getProducts({
			productIds: 'ExampleID,MissingID,ExampleID2'
		})

		expect(requests).toEqual([
			productRequest('ExampleID'),
			productRequest('MissingID'),
			productRequest('ExampleID2')
		])

		expect(result).toEqual([
			exampleProduct('ExampleID'),
			null,
			exampleProduct('ExampleID2')
		])
	})

	test('getRawProducts', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceProductRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const result = await codec.getRawProducts({
			productIds: 'ExampleID,ExampleID2'
		})

		expect(requests).toEqual([
			productRequest('ExampleID'),
			productRequest('ExampleID2')	
		])

		expect(result).toEqual([
			shopifyProduct('ExampleID').data.product,
			shopifyProduct('ExampleID2').data.product
		])
	})

	test('getRawProducts (multiple, one missing)', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceProductRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const result = await codec.getRawProducts({
			productIds: 'ExampleID,MissingID,ExampleID2'
		})
		expect(requests).toEqual([
			productRequest('ExampleID'),
			productRequest('MissingID'),
			productRequest('ExampleID2')	
		])

		expect(result).toEqual([
			shopifyProduct('ExampleID').data.product,
			null,
			shopifyProduct('ExampleID2').data.product
		])
	})

	test('getCategory', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceProductsByCategoryRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const categories = await codec.getCategory({ slug: 'hydrogen' })
		expect(categories).toEqual(exampleCategoryProducts)

		expect(requests).toEqual([
			collectionsRequest,
			productsByCategoryRequest
		])
	})

	test('getMegaMenu', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceCollectionsRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const categories = await codec.getMegaMenu({})
		expect(categories).toEqual(exampleMegaMenu)
		expect(requests).toEqual([
			collectionsRequest
		])
	})

	test('getCustomerGroups', async () => {
		// Setup with the right fixture
		massMock(axios, requests, commerceSegmentsRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		// Test
		const customerGroups = await codec.getCustomerGroups({})
		expect(customerGroups).toEqual(exampleCustomerGroups)
		expect(requests).toEqual([
			segmentsRequest
		])
	})
})