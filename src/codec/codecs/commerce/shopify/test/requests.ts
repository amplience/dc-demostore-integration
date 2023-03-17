import { 
	collections, 
	productById, 
	productsByCategory, 
	productsByQuery, 
	segments 
} from '../queries'

export const collectionsRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/api/version',
		headers: {
			'X-Shopify-Storefront-Access-Token': 'access_token'
		},
		url: 'graphql.json',
		data: {
			query: collections,
			variables: {
				pageSize: 100,
				after: undefined
			}
		}
	},
	url: 'https://site_id.myshopify.com/api/version/graphql.json'
}

export const segmentsRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/admin/api/version',
		headers: {
			'X-Shopify-Access-Token': 'admin_access_token'
		},
		url: 'graphql.json',
		data: {
			query: segments,
			variables: {
				pageSize: 100,
				after: undefined
			}
		}
	},
	url: 'https://site_id.myshopify.com/admin/api/version/graphql.json'
}

export const productRequest = (id: string) => ({
	config: {
		baseURL: 'https://site_id.myshopify.com/api/version',
		headers: {
			'X-Shopify-Storefront-Access-Token': 'access_token'
		},
		url: 'graphql.json',
		data: {
			query: productById,
			variables: {
				id
			}
		}
	},
	url: 'https://site_id.myshopify.com/api/version/graphql.json'
})

export const productsByKeywordRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/api/version',
		headers: {
			'X-Shopify-Storefront-Access-Token': 'access_token'
		},
		url: 'graphql.json',
		data: {
			query: productsByQuery,
			variables: {
				pageSize: 100,
				query: 'fulfilled',
				after: undefined
			}
		}
	},
	url: 'https://site_id.myshopify.com/api/version/graphql.json'
}

export const productsByCategoryRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/api/version',
		headers: {
			'X-Shopify-Storefront-Access-Token': 'access_token'
		},
		url: 'graphql.json',
		data: {
			query: productsByCategory,
			variables: {
				pageSize: 100,
				handle: 'hydrogen',
				after: undefined
			}
		}
	},
	url: 'https://site_id.myshopify.com/api/version/graphql.json'
}