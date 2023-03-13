export const ctoolsProduct = (id: string) => ({
	id: id,
	version: 24,
	productType: {
		typeId: 'product-type',
		id: `${id}-type`,
	},
	name: {
		en: 'DECIEM PUMP (FOR HIGHER-VISCOSITY NIOD SERUMS, 30ML BOTTLE) - 1PC (P)',
		es: 'BOMBA DECIEM (PARA SUEROS NIOD DE MAYOR VISCOSIDAD, BOTELLA DE 30 ML) - 1 PIEZA (P)',
		fr: 'POMPE À DÉCIEM (POUR SÉRUMS NIOD À VISCOSITÉ PLUS ÉLEVÉE, FLACON DE 30 ML) - 1PC (P)',
	},
	description: {
		en: 'Example description.\n\n',
	},
	categories: [
		{
			typeId: 'category',
			id: 'men-id',
		},
	],
	categoryOrderHints: {},
	slug: {
		en: 'pump-for-higher-viscosity-niod-serums-30ml-bottle-1pc-p',
	},
	metaTitle: {
		fr: '',
		it: '',
		en: '',
		de: '',
		es: '',
	},
	metaDescription: {
		fr: '',
		it: '',
		en: '',
		de: '',
		es: '',
	},
	variants: [],
	masterVariant: {
		attributes: [
			{
				name: 'articleNumberMax',
				value: '0CAIS5',
			},
			{
				name: 'baseId',
				value: '0CAIS5',
			},
		],
		assets: [],
		images: [
			{
				url: 'https://cdn.media.amplience.net/i/willow/nid-pump',
				dimensions: {
					w: 900,
					h: 900,
				},
			},
		],
		prices: [
			{
				id: `${id}-price`,
				value: {
					type: 'centPrecision',
					currencyCode: 'USD',
					centAmount: 250,
					fractionDigits: 2,
				},
				discounted: {
					value: {
						type: 'centPrecision',
						currencyCode: 'USD',
						centAmount: 212,
						fractionDigits: 2,
					},
					discount: {
						typeId: `${id}-discount`,
						id: 'discount-id',
					},
				},
			},
		],
		key: '0CAIS5',
		sku: '0CAIS5',
		id: 1,
	},
	searchKeywords: {},
	hasStagedChanges: false,
	published: true,
	key: 'pump-for-higher-viscosity-niod-serums-30ml-bottle-1pc-p',
	taxCategory: {
		typeId: 'tax-category',
		id: `${id}-tax`,
	},
	createdAt: '2021-09-14T01:35:45.312Z',
	lastModifiedAt: '2021-11-17T18:06:30.189Z',
})

export const ctoolsSearchResult = (
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
			ctoolsProduct(ids ? ids[index] : 'Hit' + (pageBase + index))
		),
		facets: {},
	}
}

export const ctoolsCategories = {
	limit: 500,
	offset: 0,
	count: 1,
	total: 1,
	results: [
		{
			id: 'men-id',
			version: 5,
			lastMessageSequenceNumber: 3,
			createdAt: '2020-04-14T17:38:16.788Z',
			lastModifiedAt: '2021-11-17T18:04:29.834Z',
			lastModifiedBy: {
				clientId: 'client',
				isPlatformClient: false,
			},
			createdBy: {
				clientId: 'client',
				isPlatformClient: false,
			},
			key: 'men',
			name: {
				fr: 'Homme',
				it: 'Uomo',
				en: 'Men',
				de: 'Männer',
				es: 'Hombre',
			},
			slug: {
				en: 'men',
			},
			ancestors: [],
			orderHint: '0.00001586885896788798824213',
			externalId: '3',
			assets: [],
		},
	],
}

export const ctoolsCustomerGroups = {
	limit: 20,
	offset: 0,
	count: 2,
	total: 2,
	results: [
		{
			id: 'b2b-group',
			version: 1,
			createdAt: '2020-04-14T17:38:16.220Z',
			lastModifiedAt: '2020-04-14T17:38:16.220Z',
			lastModifiedBy: {
				clientId: 'client',
				isPlatformClient: false,
			},
			createdBy: {
				clientId: 'client',
				isPlatformClient: false,
			},
			name: 'b2b',
			key: 'b2b',
		},
		{
			id: 'silver-group',
			version: 1,
			createdAt: '2020-04-14T17:38:16.225Z',
			lastModifiedAt: '2020-04-14T17:38:16.225Z',
			lastModifiedBy: {
				clientId: 'client',
				isPlatformClient: false,
			},
			createdBy: {
				clientId: 'client',
				isPlatformClient: false,
			},
			name: 'Silver',
			key: 'silver',
		},
	],
}
