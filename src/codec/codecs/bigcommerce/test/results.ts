// BigCommerce Customer Groups result
export const exampleCustomerGroups = [
	{
		id: '1',
		name: 'High Value'
	}
]

// BigCommerce Category Hierarchy result
export const exampleMegaMenu = [
	{
		id: '1',
		name: 'Men',
		slug: 'men',
		children: [],
		products: [],
	},
	{
		id: "23",
		name: "Browse all",
		slug: "browse-all",
		children: [],
		products: []
	},
	{
		id: "18",
		name: "Bathroom",
		slug: "bathroom",
		children: [],
		products: []
	},
	{
		id: "19",
		name: "Garden",
		slug: "garden",
		children: [],
		products: []
	},
	{
		id: "21",
		name: "Kitchen",
		slug: "kitchen",
		children: [],
		products: []
	},
	{
		id: "20",
		name: "Publications",
		slug: "publications",
		children: [],
		products: []
	},
	{
		id: "22",
		name: "Maintenance",
		slug: "maintenance",
		children: [],
		products: []
	}
]

// BigCommerce Product result
export const exampleProduct = (id: string) => ({
	id: id,
	shortDescription: "<p>Born out of a true passion for coffee, Able Brewing set out to create a coffee machine that was both aesthetically pleasing and functional. To achieve this, they had to imagine a product that would easily fit into everyone's morning routine and that would highlight the lovingly perfected Kone filter. Inspired by Japanese design and the 1950s, this coffee maker elegantly infuses filter coffees. Its multi-block design allows the top part to be removed once the infusion is complete and the bottom part to be used as a pitcher. The exterior ceramic coating is dishwasher safe.</p>\n<p>Made in USA</p>\n<p>Dimensions in cm: 20.3 x 15.2</p>\n<p>Capacity: 946 ml</p>",
	longDescription: "<p>Born out of a true passion for coffee, Able Brewing set out to create a coffee machine that was both aesthetically pleasing and functional. To achieve this, they had to imagine a product that would easily fit into everyone's morning routine and that would highlight the lovingly perfected Kone filter. Inspired by Japanese design and the 1950s, this coffee maker elegantly infuses filter coffees. Its multi-block design allows the top part to be removed once the infusion is complete and the bottom part to be used as a pitcher. The exterior ceramic coating is dishwasher safe.</p>\n<p>Made in USA</p>\n<p>Dimensions in cm: 20.3 x 15.2</p>\n<p>Capacity: 946 ml</p>",
	slug: "sample-able-brewing-system",
	name: "[Sample] Able Brewing System",
	categories: [],
	variants: [
		{
			sku: "ABS",
			listPrice: "$225.00",
			salePrice: "$0.00",
			attributes: {}
		}
	]
})