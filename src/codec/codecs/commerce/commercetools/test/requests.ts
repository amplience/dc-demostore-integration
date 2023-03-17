export const oauthRequest = {
	config: {
		auth: {
			password: 'test_secret',
			username: 'test_client',
		},
		data: {},
		url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials'
	},
	url: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials'
}

export const categoriesRequest = {
	config: {
		baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
		headers: {
			Authorization: 'Bearer token',
		},
		method: 'GET',
		url: '/categories?offset=0&limit=500',
	},
	url: 'https://api.europe-west1.gcp.commercetools.com/test/categories?offset=0&limit=500'
}

export const customerGroupsRequest = {
	config: {
		baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
		headers: {
			'Authorization': 'Bearer token',
		},
		method: 'GET',
		url: '/customer-groups?offset=0&limit=20',
	},
	url: 'https://api.europe-west1.gcp.commercetools.com/test/customer-groups?offset=0&limit=20',
}

export const searchRequest = (filter: string) => ({
	config: {
		baseURL: 'https://api.europe-west1.gcp.commercetools.com/test',
		headers: {
			Authorization: 'Bearer token',
		},
		method: 'GET',
		url: `/product-projections/search?${filter}`
	},
	url: `https://api.europe-west1.gcp.commercetools.com/test/product-projections/search?${filter}`
})
