import { Category } from '../../../../common'

export const exampleProduct = (id: string) => ({
	categories: [],
	id: id,
	longDescription:
		'This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!',
	name: 'Short Sleeve Wrap Blouse with Tie Front',
	shortDescription:
		'This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!',
	slug: 'short-sleeve-wrap-blouse-with-tie-front',
	variants: [
		{
			attributes: {
				color: 'JJ6JUXX',
				size: '016',
			},
			images: [
				{
					url: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
				},
				{
					url: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
				},
			],
			listPrice: '£69.76',
			salePrice: '£69.76',
			sku: 'variant1M',
		},
		{
			attributes: {
				color: 'JJ6JUXX',
				size: '012',
			},
			images: [
				{
					url: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
				},
				{
					url: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
				},
			],
			listPrice: '£69.76',
			salePrice: '£69.76',
			sku: 'variant2M',
		},
		{
			attributes: {
				color: 'JJ6JUXX',
				size: '014',
			},
			images: [
				{
					url: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
				},
				{
					url: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
				},
			],
			listPrice: '£69.76',
			salePrice: '£69.76',
			sku: 'variant3M',
		},
	],
})

export const exampleMegaMenu: Category[] = [
	{
		children: [],
		id: 'content-link',
		name: 'Content',
		products: [],
		slug: 'content-link',
	},
	{
		children: [
			{
				children: [],
				id: 'newarrivals-womens',
				name: 'Womens',
				products: [],
				slug: 'newarrivals-womens',
			},
			{
				children: [],
				id: 'newarrivals-mens',
				name: 'Mens',
				products: [],
				slug: 'newarrivals-mens',
			},
		],
		id: 'newarrivals',
		name: 'New Arrivals',
		products: [],
		slug: 'newarrivals',
	},
]

export const exampleCustomerGroups = [
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'Big Spenders',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Big%20Spenders',
		name: 'Big Spenders',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'Everyone',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Everyone',
		name: 'Everyone',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'Registered',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Registered',
		name: 'Registered',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'TestStaticCustomerGroup',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/TestStaticCustomerGroup',
		name: 'TestStaticCustomerGroup',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'Unregistered',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Unregistered',
		name: 'Unregistered',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'female',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/female',
		name: 'female',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'genY',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/genY',
		name: 'genY',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'genZ',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/genZ',
		name: 'genZ',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'genx',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/genx',
		name: 'genx',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'male',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/male',
		name: 'male',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'spookygroup',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/spookygroup',
		name: 'spookygroup',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'spookygroupregistered',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/spookygroupregistered',
		name: 'spookygroupregistered',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'testgroup',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/testgroup',
		name: 'testgroup',
	},
	{
		_resource_state: 'unknown',
		_type: 'customer_group',
		id: 'testgroup2',
		link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/testgroup2',
		name: 'testgroup2',
	},
]
