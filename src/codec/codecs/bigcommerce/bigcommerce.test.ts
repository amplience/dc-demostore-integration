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
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=ExampleID&include=images,variants': {
			data: {
				data: bigcommerceProduct('ExampleID')
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?id:in=ExampleID,ExampleID2&include=images,variants': {
			data: {
				data: [
					...bigcommerceProduct('ExampleID'),
					...bigcommerceProduct('ExampleID2')
				]
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?keyword=keyword': {
			data: {
				data: [
					...bigcommerceProduct('ExampleID1'),
					...bigcommerceProduct('ExampleID2'),
					...bigcommerceProduct('ExampleID3')
				]
			}
		},
		'https://api.bigcommerce.com/stores/store_hash/v3/catalog/products?categories:in=CategoryID': {
			data: {
				data: [
					...bigcommerceProduct('ExampleID'),
					...bigcommerceProduct('ExampleID2')
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
			id: 'ExampleID'
		})
		expect(requests).toEqual([
			productRequest('ExampleID')
		])
		expect(result).toEqual(exampleProduct('ExampleID'))
	})

	// Get BigCommerce Products
	test('getProducts (multiple)', async () => {
		const result = await codec.getProducts({
			productIds: 'ExampleID,ExampleID2'
		})
		expect(requests).toEqual([
			productRequest('ExampleID,ExampleID2')
		])
		expect(result).toEqual([
			exampleProduct('ExampleID'),
			exampleProduct('ExampleID2')
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
		expect(result).toEqual(Array.from({ length: 3 }).map((_, index) => exampleProduct(`ExampleID${index + 1}`)))
	})

	// Get BigCommerce Products (from category)
	test('getProducts (category)', async () => {
		const products = await codec.getProducts({
			category: {
				children: [],
				products: [],
				id: 'CategoryID',
				name: 'Category',
				slug: 'category',
			}
		})
		expect(requests).toEqual([
			productCategoryRequest('CategoryID')
		])
		expect(products).toEqual([
			exampleProduct('ExampleID'),
			exampleProduct('ExampleID2')
		])
	})

	// TODO
	test('getProduct (missing)', async () => {
		await expect(codec.getProduct({
			id: 'MissingID'
		})).resolves.toBeNull()
		expect(requests).toEqual([
			searchRequest('filter=id%3A%22MissingID%22&offset=0&limit=20')
		])
	})

	// TODO
	test('getProducts (multiple, one missing)', async () => {
		const result = await codec.getProducts({
			productIds: 'ExampleID,NotHere,ExampleID2'
		})
		expect(requests).toEqual([
			searchRequest('filter=id%3A%22ExampleID%22%2C%22NotHere%22%2C%22ExampleID2%22&offset=0&limit=20')
		])
		expect(result).toEqual([
			exampleProduct('ExampleID'),
			null,
			exampleProduct('ExampleID2')
		])
	})

	// TODO
	test('getRawProducts', async () => {
		const result = await codec.getRawProducts({
			productIds: 'ExampleID'
		})
		expect(requests).toEqual([
			searchRequest('filter=id%3A%22ExampleID%22&offset=0&limit=20')
		])
		expect(result).toEqual([
			bigcommerceProduct('ExampleID')
		])
	})

	// TODO
	test('getRawProducts (multiple, one missing)', async () => {
		const result = await codec.getRawProducts({
			productIds: 'ExampleID,NotHere,ExampleID2'
		})
		expect(requests).toEqual([
			searchRequest('filter=id%3A%22ExampleID%22%2C%22NotHere%22%2C%22ExampleID2%22&offset=0&limit=20')
		])
		expect(result).toEqual([
			bigcommerceProduct('ExampleID'),
			null,
			bigcommerceProduct('ExampleID2')
		])
	})

	// TODO
	test('getCategory', async () => {
		const category = await codec.getCategory({ slug: 'men' })
		expect(requests).toEqual([
			searchRequest('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=0&limit=20'),
			searchRequest('filter=categories.id%3A+subtree%28%22men-id%22%29&offset=20&limit=20')
		])
		expect(category.products.length).toEqual(30)
		expect(category).toEqual({
			children: [],
			products: Array.from({ length: 30 }).map((_, index) => exampleProduct('Hit' + index)),
			id: 'men-id',
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