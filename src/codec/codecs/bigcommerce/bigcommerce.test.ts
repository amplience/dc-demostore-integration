import { Request, MockFixture, massMock } from '../../../common/test/rest-mock'
import axios from 'axios'
import { CommerceCodec } from '../core'
import BigCommerceCodecType, { BigCommerceCommerceCodec } from '.'
import { bigcommerceProduct, bigcommerceCategories, bigcommerceCustomerGroups } from './test/responses'
import { exampleCustomerGroups, exampleMegaMenu, exampleProduct } from './test/results'
import { categoriesRequest, customerGroupsRequest, searchRequest, productRequest, productCategoryRequest } from './test/requests'
import { config } from './test/config'

jest.mock('axios')

const commerceRequests: MockFixture = {
	get: {
		'https://api.bigcommerce.com/stores/store_hash/v2/customer_groups': {
			data: bigcommerceCustomerGroups
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/categories/tree': {
			data: {
				data: bigcommerceCategories
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=1&include=images,variants': {
			data: {
				data: bigcommerceProduct(1)
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=1,3&include=images,variants': {
			data: {
				data: [
					...bigcommerceProduct(1),
					...bigcommerceProduct(3)
				]
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?keyword=keyword': {
			data: {
				data: [
					...bigcommerceProduct(2),
					...bigcommerceProduct(3),
					...bigcommerceProduct(4)
				]
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?categories:in=1': {
			data: {
				data: [
					...bigcommerceProduct(1),
					...bigcommerceProduct(3)
				]
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=-1&include=images,variants': {
			data: {
				data: []
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=1,-1,3&include=images,variants': {
			data: {
				data: [
					...bigcommerceProduct(1),
					null,
					...bigcommerceProduct(3)
				]
			}
		},
	}
}

// BigCommerce Integration tests
describe('bigcommerce integration', function () {
	let codec: CommerceCodec
	let requests: Request[]

	beforeEach(async () => {
		jest.resetAllMocks()
		requests = []
		massMock(axios, requests, commerceRequests)
		codec = new BigCommerceCommerceCodec(config)
		await codec.init(new BigCommerceCodecType())
	})

	// Get BigCommerce Product
	test('getProduct', async () => {
		const result = await codec.getProduct({
			id: "1"
		})
		expect(requests).toEqual([
			productRequest("1")
		])
		expect(result).toEqual(exampleProduct("1"))
	})

	// Get BigCommerce Products
	test('getProducts (multiple)', async () => {
		const result = await codec.getProducts({
			productIds: "1,3"
		})
		expect(requests).toEqual([
			productRequest("1,3")
		])
		expect(result).toEqual([
			exampleProduct("1"),
			exampleProduct("3")
		])
	})

	// Get BigCommerce Products (filter by keyword in name or sku)
	test('getProducts (keyword)', async () => {
		const result = await codec.getProducts({
			keyword: 'keyword'
		})
		expect(requests).toEqual([
			searchRequest('keyword')
		])
		expect(result).toEqual(Array.from({ length: 3 }).map((_, index) => exampleProduct(`${index + 2}`)))
	})

	// Get BigCommerce Products (from category)
	test('getProducts (category)', async () => {
		const products = await codec.getProducts({
			category: {
				children: [],
				products: [],
				id: '1',
				name: 'Category',
				slug: 'category',
			}
		})
		expect(requests).toEqual([
			productCategoryRequest(1)
		])
		expect(products).toEqual([
			exampleProduct("1"),
			exampleProduct("3")
		])
	})

	// Get BigCommerce Product (missing ID)
	test('getProduct (missing)', async () => {
		const result = await codec.getProduct({
			id: "-1"
		})
		expect(requests).toEqual([
			productRequest('-1')
		])
		expect(result).toBeNull()
	})

	// Get BigCommerce Products (one is missing)
	test('getProducts (multiple, one missing)', async () => {
		const result = await codec.getProducts({
			productIds: '1,-1,3'
		})
		expect(requests).toEqual([
			productRequest("1,-1,3")
		])
		expect(result).toEqual([
			exampleProduct("1"),
			null,
			exampleProduct("3")
		])
	})

	// Get BigCommerce Products (raw, original value)
	test('getRawProducts', async () => {
		const result = await codec.getRawProducts({
			productIds: "1"
		})
		expect(requests).toEqual([
			productRequest("1")
		])
		expect(result).toEqual(
			bigcommerceProduct(1)
		)
	})

	// Get BigCommerce Products (raw and one missing ID)
	test('getRawProducts (multiple, one missing)', async () => {
		const result = await codec.getRawProducts({
			productIds: "1,-1,3"
		})
		expect(requests).toEqual([
			productRequest("1,-1,3")
		])
		expect(result).toEqual([
			...bigcommerceProduct(1),
			null,
			...bigcommerceProduct(3)
		])
	})

	// TODO
	test('getCategory', async () => {
		const category = await codec.getCategory({ slug: 'men' })
		expect(requests).toEqual([
			categoriesRequest,
			productCategoryRequest(1)
		])
		expect(category).toEqual({
			children: [],
			products: [
				exampleProduct("1"),
				exampleProduct("3")
			],
			id: '1',
			name: 'Men',
			slug: 'men',
		})
	})

	// Get Category Hierarchy
	test('getMegaMenu', async () => {
		const megaMenu = await codec.getMegaMenu({})
		expect(requests).toEqual([
			categoriesRequest
		])
		expect(megaMenu).toEqual(exampleMegaMenu)
	})

	// Get Customer Groups
	test('getCustomerGroups', async () => {
		const customerGroups = await codec.getCustomerGroups({})
		expect(customerGroups).toEqual(exampleCustomerGroups)
		expect(requests).toEqual([
			customerGroupsRequest
		])
	})
})