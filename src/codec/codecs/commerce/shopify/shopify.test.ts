import { Request, MockFixture, massMock } from '../../../../common/test/rest-mock'
import axios from 'axios'
import { CommerceCodec } from '../../core'
import ShopifyCodecType, { ShopifyCommerceCodec } from '.'
import { shopifyCategories, shopifySegments, shopifyProduct} from './test/responses'
import { exampleCustomerGroups, exampleMegaMenu, exampleProduct } from './test/results'
import { collectionsRequest, segmentsRequest, productsRequest} from './test/requests'
import { config } from './test/config'
import { flattenConfig } from '../../../../common/util'

jest.mock('axios')

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

describe('shopify integration', function() {
	let codec: CommerceCodec
	let requests: Request[]

	beforeEach(async () => {
		jest.resetAllMocks()
		requests = []
	})

	test('getProduct', async () => {
	})

	test('getProducts (multiple)', async () => {
	})

	test('getProducts (keyword)', async () => {
	})

	test('getProducts (category)', async () => {
	})

	test('getProduct (missing)', async () => {
	})

	test('getProducts (multiple, one missing)', async () => {
	})

	test('getRawProducts', async () => {
	})

	test('getRawProducts (multiple, one missing)', async () => {
	})

	test('getCategory', async () => {
	})

	test('getMegaMenu', async () => {
		massMock(axios, requests, commerceCollectionsRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())
		
		const categories = await codec.getMegaMenu({})
		expect(categories).toEqual(exampleMegaMenu)
		expect(requests).toEqual([
			collectionsRequest
		])
	})

	test('getCustomerGroups', async () => {
		massMock(axios, requests, commerceSegmentsRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())

		const customerGroups = await codec.getCustomerGroups({})
		expect(customerGroups).toEqual(exampleCustomerGroups)
		expect(requests).toEqual([
			segmentsRequest
		])
	})
})