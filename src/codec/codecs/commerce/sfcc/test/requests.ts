export const categoryRequest = {
	config: {
		baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
		params: {
			client_id: 'test-client',
		},
		url: '/s/TestSite/dw/shop/v22_4/categories/root?levels=4',
	},
	url: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/categories/root?levels=4'
}

export const productIdRequest = (id: string) => ({
	config: {
		baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
		params: {
			client_id: 'test-client',
		},
		url: `/s/TestSite/dw/shop/v22_4/products/${id}?expand=prices,options,images,variations&all_images=true`,
	},
	url: `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?expand=prices,options,images,variations&all_images=true`,
})

export const oauthRequest = {
	config: {
		data: {},
		headers: {
			Authorization: 'Basic undefined',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		params: {
			client_id: 'test-client',
		},
		url: 'https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials'
	},
	url: 'https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials'
}

export const customerGroupsRequest = {
	config: {
		method: 'GET',
		baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
		headers: {
			Authorization: 'Bearer token',
		},
		url: '/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000',
	},
	url: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000'
}

export const productIdRequests = (id: string, total: number) => Array.from({length: total}).map((_, index) => productIdRequest(id + index))

export const keywordSearch = (start: number) => ({
	config: {
		baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
		params: {
			client_id: 'test-client',
		},
		url: `/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=${start}&count=200`,
	},
	url: `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?q=Hit&start=${start}&count=200`,
})

export const categorySearch = (start: number) => ({
	config: {
		baseURL: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
		params: {
			client_id: 'test-client',
		},
		url: `/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=${start}&count=200`,
	},
	url: `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=${start}&count=200`,
})