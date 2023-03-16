import { segments } from "../queries"

export const collectionsRequest = {
	config: {
		url: ''
	},
	url: ''
}

export const segmentsRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/admin/api/version',
		headers: {
			'X-Shopify-Access-Token': 'admin_access_token'
		},
		url: 'graphql.json',
		query: segments,
		variables: {
			pageSize: 100
		}
	},
	url: 'https://site_id.myshopify.com/admin/api/version/graphql.json'
}

export const productsRequest = {
	config: {
		url: ''
	},
	url: ''
}