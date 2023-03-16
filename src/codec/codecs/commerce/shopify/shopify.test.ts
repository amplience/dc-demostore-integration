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

const commerceRequests: MockFixture = {
	post: {
		'https://site_id.myshopify.com/admin/api/version/graphql.json': {
			data: shopifySegments
		}
	}
}

describe('shopify integration', function() {
	let codec: CommerceCodec
	let requests: Request[]

	beforeEach(async () => {
		jest.resetAllMocks()
		requests = []
		massMock(axios, requests, commerceRequests)
		codec = new ShopifyCommerceCodec(flattenConfig(config))
		await codec.init(new ShopifyCodecType())
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
	})

	test('getCustomerGroups', async () => {
		const customerGroups = await codec.getCustomerGroups({})
		expect(customerGroups).toEqual(exampleCustomerGroups)
		expect(requests).toEqual([
			segmentsRequest
		])
	})
})