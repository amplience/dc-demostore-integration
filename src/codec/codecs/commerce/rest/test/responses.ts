import { Category, CustomerGroup, Product } from '../../../../../common'

export const rootCategory: Category = {
	id: 'root',
	name: 'root',
	slug: 'root-cat',
	parent: null,
	image: {
		url: 'root-image'
	},
	children: [],
	products: [],
}

export const childCategories: Category[] = [{
	id: 'child1',
	name: 'child1',
	slug: 'child1-cat',
	parent: rootCategory,
	image: {
		url: 'child1-image'
	},
	children: [],
	products: [],
},
{
	id: 'child2',
	name: 'child2',
	slug: 'child2-cat',
	parent: rootCategory,
	image: {
		url: 'child2-image'
	},
	children: [],
	products: [],
}]

rootCategory.children = childCategories

export const categories: Category[] = [
	rootCategory,
	...childCategories
]

export const groups: CustomerGroup[] = [
	{
		id: 'group-1',
		name: 'group-1'
	},
	{
		id: 'group-2',
		name: 'group-2'
	}
]

export const restProduct = (id: string, label: string, category: Category): Product => ({
	id: id,
	name: label,
	slug: id,
	shortDescription: `${label} short description.`,
	longDescription: `${label} long description.`,
	imageSetId: `${id}-image`,
	categories: [category],
	variants: []
})

export const products: Product[] = [
	restProduct('rootProduct', 'A product in the root', rootCategory),
	restProduct('catProduct1', 'A product in the first category', childCategories[0]),
	restProduct('catProduct2', 'A second product in the first category', childCategories[0]),
	restProduct('cat2Product1', 'A product in the second category', childCategories[1]),
	restProduct('cat2Product2', 'A second product in the second category', childCategories[1]),
	restProduct('cat2Product3', 'A third product in the second category', childCategories[1])
]