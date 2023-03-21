// BigCommerce Customer Groups result
export const exampleCustomerGroups = [
	{
		id: '1',
		name: 'High Value'
	}
]

// BigCommerce Category Hierarchy result
export const exampleCategoryTree = [
	{
		id: '1',
		name: 'Men',
		slug: 'men',
		children: [],
		products: [],
	},
	{
		id: '23',
		name: 'Browse all',
		slug: 'browse-all',
		children: [],
		products: []
	},
	{
		id: '18',
		name: 'Bathroom',
		slug: 'bathroom',
		children: [],
		products: []
	},
	{
		id: '19',
		name: 'Garden',
		slug: 'garden',
		children: [],
		products: []
	},
	{
		id: '21',
		name: 'Kitchen',
		slug: 'kitchen',
		children: [],
		products: []
	},
	{
		id: '20',
		name: 'Publications',
		slug: 'publications',
		children: [],
		products: []
	},
	{
		id: '22',
		name: 'Maintenance',
		slug: 'maintenance',
		children: [],
		products: []
	}
]

// BigCommerce Product result
export const exampleProduct = (id: string) => ({
	id: id,
	shortDescription: '<p>La cafetière Chemex a été mise au point en 1939 par son célèbre inventeur, Peter J. Schlumbohm.</p>\n<p>Fort de ses connaissances en filtration et extraction, M. Schlumbohm a créé une cafetière qui touche à la perfection. Les angles de la partie entonnoir, l\'épaisseur du filtre papier et le compartiment d\'aération permettent au café d\'infuser en un temps voulu et de libérer ses arômes, alors qu\'ils sont généralement inhibés dans les autres modes de préparation. Le résultat ? Une tasse de café soyeux et sans amertume, en moins de 4 minutes.</p>\n<p>Fabriqué dans du verre borosilicate résistant à la chaleur et équipé d\'une simple poignée en bois, le design de la cafetière Chemex fait partie de la collection permanente du Musée d\'art moderne.</p>\n<p>Dimensions en cm : 21 (h) × 7,6 (dia)</p>\n<p>Capacité : 473 ml</p>',
	longDescription: '<p>La cafetière Chemex a été mise au point en 1939 par son célèbre inventeur, Peter J. Schlumbohm.</p>\n<p>Fort de ses connaissances en filtration et extraction, M. Schlumbohm a créé une cafetière qui touche à la perfection. Les angles de la partie entonnoir, l\'épaisseur du filtre papier et le compartiment d\'aération permettent au café d\'infuser en un temps voulu et de libérer ses arômes, alors qu\'ils sont généralement inhibés dans les autres modes de préparation. Le résultat ? Une tasse de café soyeux et sans amertume, en moins de 4 minutes.</p>\n<p>Fabriqué dans du verre borosilicate résistant à la chaleur et équipé d\'une simple poignée en bois, le design de la cafetière Chemex fait partie de la collection permanente du Musée d\'art moderne.</p>\n<p>Dimensions en cm : 21 (h) × 7,6 (dia)</p>\n<p>Capacité : 473 ml</p>',
	slug: 'sample-cafetiere-chemex-3-tasses',
	name: '[Sample] Cafetière Chemex 3 tasses',
	categories: [],
	variants: [
		{
			id: '67',
			sku: 'CC3C',
			listPrice: '$49.50',
			salePrice: '$0.00',
			attributes: {},
			images: [
				{
					url: 'https://cdn11.bigcommerce.com/s-85ttsow7dj/products/88/images/292/3cupchemex5.1677080507.386.513.jpg?c=1'
				}
			]
		}
	]
})