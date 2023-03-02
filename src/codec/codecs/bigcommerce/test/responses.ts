// TODO
export const bigcommerceProduct = (id: string) => ({
    id: id,
    name: '[Sample] Chemex Coffee Maker 3 cups',
	type: 'physical',
	sku: 'CC3C',
	description: '<p>The Chemex coffee maker was invented in 1939 by its famous inventor, Peter J. Schlumbohm.</p>\n' +
	"<p>Drawing on his knowledge of filtration and extraction, Mr. Schlumbohm created a coffee maker that comes close to perfection. The angles of the funnel, the thickness of the paper filter, and the air vent allow the coffee to infuse for the right amount of time and release its flavors, which are typically inhibited in other brewing methods. The result? A smooth, non-bitter cup of coffee in less than 4 minutes.</p>\n" +
	"<p>Made of heat-resistant borosilicate glass and equipped with a simple wooden handle, the Chemex coffee maker's design is part of the permanent collection of the Museum of Modern Art.</p>\n" +
	'<p>Dimensions in cm: 21 (h) × 7.6 (dia)</p>\n' +
	'<p>Capacity: 473 ml</p>',
    weight: 1,
    width: 0,
    depth: 0,
    height: 0,
    price: 49.5,
    cost_price: 0,
    retail_price: 0,
    sale_price: 0,
    map_price: 0,
    tax_class_id: 0,
    product_tax_code: '',
    calculated_price: 49.5,
    categories: [ 21, 23 ],
    brand_id: 0,
    option_set_id: null,
    option_set_display: 'right',
    inventory_level: 0,
    inventory_warning_level: 0,
    inventory_tracking: 'none',
    reviews_rating_sum: 0,
    reviews_count: 0,
    total_sold: 621,
    fixed_cost_shipping_price: 0,
    is_free_shipping: false,
    is_visible: true,
    is_featured: false,
    related_products: [ -1 ],
    warranty: '',
    bin_picking_number: '0',
    layout_file: 'product.html',
    upc: '',
    mpn: '',
    gtin: '',
    search_keywords: '',
    availability: 'available',
    availability_description: '',
    gift_wrapping_options_type: 'any',
    gift_wrapping_options_list: [],
    sort_order: 0,
    condition: 'New',
    is_condition_shown: false,
    order_quantity_minimum: 0,
    order_quantity_maximum: 0,
    page_title: '',
    meta_keywords: [],
    meta_description: '',
    date_created: '2015-07-03T18:19:17+00:00',
    date_modified: '2015-07-03T20:46:38+00:00',
    view_count: 5,
    preorder_release_date: null,
    preorder_message: '0',
    is_preorder_only: false,
    is_price_hidden: false,
    price_hidden_label: '0',
    custom_url: { url: '/chemex-coffeemaker-3-cup/', is_customized: false },
    base_variant_id: 67,
    open_graph_type: 'product',
    open_graph_title: '',
    open_graph_description: '',
    open_graph_use_meta_description: true,
    open_graph_use_product_name: true,
    open_graph_use_image: true,
    variants: [], // TODO UPDATE
    images: []
  })

// TODO
export const bigcommerceSearchResult = (
	total: number,
	pageSize: number,
	pageNumber: number,
	ids?: string[]
) => {
	const pageBase = pageNumber * pageSize
	const count = Math.min(total - pageBase, pageSize)

	return {
		limit: pageSize,
		offset: pageBase,
		count,
		total,
		results: Array.from({ length: count }).map((_, index) =>
			bigcommerceProduct(ids ? ids[index] : 'Hit' + (pageBase + index))
		),
		facets: {},
	}
}

// BigCommerce Category Hierarchy response
export const bigcommerceCategories = [
    {
        id: 1,
        parent_id: 0,
        name: "Men",
        is_visible: true,
        url: "/men/",
        children: []
    },
    {
        id: 23,
        parent_id: 0,
        name: "Browse all",
        is_visible: true,
        url: "/shop-all/",
        children: []
    },
    {
        id: 18,
        parent_id: 0,
        name: "Bathroom",
        is_visible: true,
        url: "/bath/",
        children: []
    },
    {
        id: 19,
        parent_id: 0,
        name: "Garden",
        is_visible: true,
        url: "/garden/",
        children: []
    },
    {
        id: 21,
        parent_id: 0,
        name: "Kitchen",
        is_visible: true,
        url: "/kitchen/",
        children: []
    },
    {
        id: 20,
        parent_id: 0,
        name: "Publications",
        is_visible: true,
        url: "/publications/",
        children: []
    },
    {
        id: 22,
        parent_id: 0,
        name: "Maintenance",
        is_visible: true,
        url: "/utility/",
        children: []
    }
]

// BigCommerce Customer Groups response
export const bigcommerceCustomerGroups = [
	{
		id: 1,
		name: 'High Value',
		category_access: { type: "all" },
		discount_rules: [],
		is_default: false,
		is_group_for_guests: false
	}
]
