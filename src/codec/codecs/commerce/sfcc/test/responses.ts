import { MockRequests } from '../../../../../common/test/rest-mock'

export const sfccSearchHit = (id: string, categorySlug: string) => ({
	_type: 'product_search_hit',
	hit_type: 'master',
	link: `https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?start=0&count=200&refine_1=cgid%3D${categorySlug}&client_id=test-client`,
	product_id: id,
	product_name: 'Product ' + { id },
	product_type: {
		_type: 'product_type',
		master: true,
	},
	represented_product: {
		_type: 'product_ref',
		id: id + 'ref',
		link: `https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}ref?start=0&count=200&refine_1=cgid%3D${categorySlug}&client_id=test-client`,
	},
})

export const sfccProduct = (id: string) => ({
	_v: '22.4',
	_type: 'product',
	currency: 'GBP',
	id: id,
	image_groups: [
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, , large',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, ',
				},
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, , large',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, ',
				},
			],
			view_type: 'large',
		},
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, large',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, large',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
			],
			variation_attributes: [
				{
					_type: 'variation_attribute',
					id: 'color',
					values: [
						{
							_type: 'variation_attribute_value',
							value: 'JJ6JUXX',
						},
					],
				},
			],
			view_type: 'large',
		},
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, , medium',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, ',
				},
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, , medium',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, ',
				},
			],
			view_type: 'medium',
		},
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, medium',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, medium',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
			],
			variation_attributes: [
				{
					_type: 'variation_attribute',
					id: 'color',
					values: [
						{
							_type: 'variation_attribute_value',
							value: 'JJ6JUXX',
						},
					],
				},
			],
			view_type: 'medium',
		},
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, , small',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, ',
				},
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, , small',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, ',
				},
			],
			view_type: 'small',
		},
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, small',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, small',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
			],
			variation_attributes: [
				{
					_type: 'variation_attribute',
					id: 'color',
					values: [
						{
							_type: 'variation_attribute_value',
							value: 'JJ6JUXX',
						},
					],
				},
			],
			view_type: 'small',
		},
		{
			_type: 'image_group',
			images: [
				{
					_type: 'image',
					alt: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi, swatch',
					dis_base_link:
						'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/swatch/PG.10235834.JJ6JUXX.CP.jpg',
					link: 'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/swatch/PG.10235834.JJ6JUXX.CP.jpg',
					title: 'Short Sleeve Wrap Blouse with Tie Front, Slate Multi',
				},
			],
			variation_attributes: [
				{
					_type: 'variation_attribute',
					id: 'color',
					values: [
						{
							_type: 'variation_attribute_value',
							value: 'JJ6JUXX',
						},
					],
				},
			],
			view_type: 'swatch',
		},
	],
	long_description:
		'This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!',
	master: {
		_type: 'master',
		link: `https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?all_images=true&client_id=test-client`,
		master_id: id,
		price: 69.76,
	},
	min_order_quantity: 1,
	name: 'Short Sleeve Wrap Blouse with Tie Front',
	page_description:
		'This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!',
	page_title: 'Short Sleeve Wrap Blouse with Tie Front',
	price: 69.76,
	price_per_unit: 69.76,
	primary_category_id: 'womens-clothing-tops',
	short_description:
		'This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!',
	step_quantity: 1,
	type: {
		_type: 'product_type',
		master: true,
	},
	valid_from: {
		default: '2011-02-09T05:00:00.000Z',
	},
	variants: [
		{
			_type: 'variant',
			link: 'https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/variant1M?all_images=true&client_id=test-client',
			price: 69.76,
			product_id: 'variant1M',
			variation_values: {
				color: 'JJ6JUXX',
				size: '016',
			},
		},
		{
			_type: 'variant',
			link: 'https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/variant2M?all_images=true&client_id=test-client',
			price: 69.76,
			product_id: 'variant2M',
			variation_values: {
				color: 'JJ6JUXX',
				size: '012',
			},
		},
		{
			_type: 'variant',
			link: 'https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/variant3M?all_images=true&client_id=test-client',
			price: 69.76,
			product_id: 'variant3M',
			variation_values: {
				color: 'JJ6JUXX',
				size: '014',
			},
		},
	],
	variation_attributes: [
		{
			_type: 'variation_attribute',
			id: 'color',
			name: 'Color',
			values: [
				{
					_type: 'variation_attribute_value',
					name: 'Slate Multi',
					orderable: true,
					value: 'JJ6JUXX',
				},
			],
		},
		{
			_type: 'variation_attribute',
			id: 'size',
			name: 'Size',
			values: [
				{
					_type: 'variation_attribute_value',
					name: '12',
					orderable: true,
					value: '012',
				},
				{
					_type: 'variation_attribute_value',
					name: '14',
					orderable: true,
					value: '014',
				},
				{
					_type: 'variation_attribute_value',
					name: '16',
					orderable: true,
					value: '016',
				},
			],
		},
	],
})

export const sfccProducts = (prefix: string, total: number): MockRequests => {
	const result: MockRequests = {}

	for (let i = 0; i < total; i++) {
		result[
			`https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${
				prefix + i
			}`
		] = {
			data: sfccProduct(prefix + i),
		}
	}

	return result
}

export const sfccSearchResult = (
	total: number,
	pageSize: number,
	pageNumber: number,
	categorySlug: string
) => {
	const pageBase = pageNumber * pageSize
	const count = Math.min(total - pageBase, pageSize)

	return {
		_v: '22.4',
		_type: 'product_search_result',
		count: count,
		hits: Array.from({ length: count }).map((_, index) =>
			sfccSearchHit('Hit' + (pageBase + index), categorySlug)
		),
		refinements: [
			{
				_type: 'product_search_refinement',
				attribute_id: 'cgid',
				label: 'Category',
				values: [
					{
						_type: 'product_search_refinement_value',
						hit_count: total,
						label: 'New Arrivals',
						value: 'newarrivals',
						values: [
							{
								_type: 'product_search_refinement_value',
								hit_count: total,
								label: 'Womens',
								value: 'newarrivals-womens',
							},
						],
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: total,
						label: 'Womens',
						value: 'womens',
					},
				],
			},
			{
				_type: 'product_search_refinement',
				attribute_id: 'c_refinementColor',
				label: 'Colour',
				values: [
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 10),
						label: 'Beige',
						presentation_id: 'beige',
						value: 'Beige',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 2),
						label: 'Black',
						presentation_id: 'black',
						value: 'Black',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 4),
						label: 'Blue',
						presentation_id: 'blue',
						value: 'Blue',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: 0,
						label: 'Navy',
						presentation_id: 'navy',
						value: 'Navy',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 5),
						label: 'Brown',
						presentation_id: 'brown',
						value: 'Brown',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 12),
						label: 'Green',
						presentation_id: 'green',
						value: 'Green',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 7),
						label: 'Grey',
						presentation_id: 'grey',
						value: 'Grey',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: 1,
						label: 'Orange',
						presentation_id: 'orange',
						value: 'Orange',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 11),
						label: 'Pink',
						presentation_id: 'pink',
						value: 'Pink',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 90),
						label: 'Purple',
						presentation_id: 'purple',
						value: 'Purple',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: 1,
						label: 'Red',
						presentation_id: 'red',
						value: 'Red',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 4),
						label: 'White',
						presentation_id: 'white',
						value: 'White',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 20),
						label: 'Yellow',
						presentation_id: 'yellow',
						value: 'Yellow',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 15),
						label: 'Miscellaneous',
						presentation_id: 'miscellaneous',
						value: 'Miscellaneous',
					},
				],
			},
			{
				_type: 'product_search_refinement',
				attribute_id: 'price',
				label: 'Price',
				values: [
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 30),
						label: '£0 - £19.99',
						value: '(0..20)',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 2),
						label: '£20 - £49.99',
						value: '(20..50)',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 3),
						label: '£50 - £99.99',
						value: '(50..100)',
					},
					{
						_type: 'product_search_refinement_value',
						hit_count: 1,
						label: '£100 - £499.00',
						value: '(100..500)',
					},
				],
			},
			{
				_type: 'product_search_refinement',
				attribute_id: 'c_isNew',
				label: 'New Arrival',
				values: [
					{
						_type: 'product_search_refinement_value',
						hit_count: Math.ceil(total / 18),
						label: 'true',
						value: 'true',
					},
				],
			},
			{
				_type: 'product_search_refinement',
				attribute_id: 'c_sheets',
				label: 'bySheets',
			},
		],
		search_phrase_suggestions: {
			_type: 'suggestion',
		},
		selected_refinements: {
			cgid: categorySlug,
		},
		sorting_options: [
			{
				_type: 'product_search_sorting_option',
				id: 'best-matches',
				label: 'Best Matches',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'price-low-to-high',
				label: 'Price Low To High',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'price-high-to-low',
				label: 'Price High to Low',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'product-name-ascending',
				label: 'Product Name A - Z',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'product-name-descending',
				label: 'Product Name Z - A',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'brand',
				label: 'Brand',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'most-popular',
				label: 'Most Popular',
			},
			{
				_type: 'product_search_sorting_option',
				id: 'top-sellers',
				label: 'Top Sellers',
			},
		],
		start: pageBase,
		total: total,
	}
}

export const sfccCategories = {
	_v: '22.4',
	_type: 'category',
	categories: [
		{
			_type: 'category',
			id: 'content-link',
			name: 'Content',
			parent_category_id: 'root',
			parent_category_tree: [
				{
					_type: 'path_record',
					id: 'content-link',
					name: 'Content',
				},
			],
			c_alternativeUrl:
				'https://test.dx.commercecloud.salesforce.com/s/TestSite/alt-urls/alt-urls.html?lang=default',
			c_enableCompare: false,
			c_showInMenu: true,
		},
		{
			_type: 'category',
			categories: [
				{
					_type: 'category',
					id: 'newarrivals-womens',
					image:
						'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/sub_banners/cat-banner-womens-clothing.jpg',
					name: 'Womens',
					page_description:
						'New Arrivals in womens fashionable and stylish Shoes, jackets and  all other clothing for unbeatable comfort day in, day out. Practical and fashionable styles wherever the occasion.',
					page_title:
						'New Arrivals in Women\'s Footwear, Outerwear, Clothing & Accessories',
					parent_category_id: 'newarrivals',
					parent_category_tree: [
						{
							_type: 'path_record',
							id: 'newarrivals',
							name: 'New Arrivals',
						},
						{
							_type: 'path_record',
							id: 'newarrivals-womens',
							name: 'Womens',
						},
					],
					c_enableCompare: false,
					c_showInMenu: true,
					c_slotBannerImage:
						'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/landing/cat-landing-slotbottom-womens-clothing.jpg',
				},
				{
					_type: 'category',
					id: 'newarrivals-mens',
					image:
						'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/sub_banners/cat-banner-mens-clothing.jpg',
					name: 'Mens',
					page_description:
						'New Arrivals in Mens  jackets and clothing for unbeatable comfort day in, day out. Practical, easy-to-wear styles wherever you\'re headed.',
					page_title: 'New Arrivals in Men\'s Clothing, Suits & Accessories',
					parent_category_id: 'newarrivals',
					parent_category_tree: [
						{
							_type: 'path_record',
							id: 'newarrivals',
							name: 'New Arrivals',
						},
						{
							_type: 'path_record',
							id: 'newarrivals-mens',
							name: 'Mens',
						},
					],
					c_enableCompare: false,
					c_showInMenu: true,
					c_slotBannerImage:
						'https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/landing/cat-landing-slotbottom-mens-dressshirts.jpg',
				},
			],
			id: 'newarrivals',
			name: 'New Arrivals',
			page_description:
				'Shop all new arrivals including women and mens clothing, jewelry, accessories, suits & more at Test Site',
			page_title:
				'Women and Mens New Arrivals in Clothing, Jewelry, Accessories & More',
			parent_category_id: 'root',
			parent_category_tree: [
				{
					_type: 'path_record',
					id: 'newarrivals',
					name: 'New Arrivals',
				},
			],
			c_enableCompare: false,
			c_headerMenuBanner:
				'<img alt="New Arrivals Image" src="https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/landing/cat-landing-slotbottom-womens-clothing.jpg" width="225" />',
			c_headerMenuOrientation: 'Vertical',
			c_showInMenu: true,
		},
	],
	id: 'root',
	name: 'Storefront Catalog - Non-EN',
}

export const sfccCustomerGroups = {
	_v: '22.4',
	_type: 'customer_groups',
	count: 14,
	data: [
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'Big Spenders',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Big%20Spenders',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'Everyone',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Everyone',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'Registered',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Registered',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'TestStaticCustomerGroup',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/TestStaticCustomerGroup',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'Unregistered',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/Unregistered',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'female',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/female',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'genY',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/genY',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'genZ',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/genZ',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'genx',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/genx',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'male',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/male',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'spookygroup',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/spookygroup',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'spookygroupregistered',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/spookygroupregistered',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'testgroup',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/testgroup',
		},
		{
			_type: 'customer_group',
			_resource_state: 'unknown',
			id: 'testgroup2',
			link: 'https://test.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups/testgroup2',
		},
	],
	start: 0,
	total: 14,
}
