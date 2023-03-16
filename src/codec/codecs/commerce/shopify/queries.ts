/**
 * GraphQL request to fetch product information (minimal set required for conversion).
 */
export const productShared = `
id
title
description
collections(first: 100) {
	edges {
		node {
			id
			handle
			title
			image {
				id
				url
				altText
			}
		}
		cursor
	}
}
tags
variants(first: 100) {
	edges {
		node {
			id
			title
			sku
			selectedOptions {
				name
				value
			}
			price {
				currencyCode
				amount
			}
			unitPrice {
				currencyCode
				amount
			}
			compareAtPrice {
				currencyCode
				amount
			}
			image {
				id
				url
				altText
			}
		}
		cursor
	}
}
images(first: 100) {
	edges {
		node {
			id
			url
			altText
		}
		cursor
	}
}
availableForSale
handle`

/**
 * GraphQL request to fetch products by query. (paginated)
 */
export const productsByQuery = `
query getProducts($pageSize: Int!, $query: String, $after: String){
	products(first: $pageSize, after: $after, query: $query) {
		edges {
			node {
				${productShared}
			}
			cursor
		}
	}
}`

/**
 * GraphQL request to fetch a product by ID.
 */
export const productById = `
query getProductById($id: ID!) {
	product(id: $id) {
		${productShared}
	}
}`

/**
 * GraphQL request to fetch products by category. (paginated)
 */
export const productsByCategory = `
query getProductsByCategory($handle: String!, $pageSize: Int!, $after: String) {
	collection(handle: $handle) {
		products(first: $pageSize, after: $after) {
			edges {
				node {
					${productShared}
				}
				cursor
			}
		}
	}
}`

/**
 * GraphQL request to fetch segments. (paginated)
 */
export const segments = `
query getSegments($pageSize: Int!, $after: String) {
	segments(first: $pageSize, after: $after) {
		edges {
			node {
				id
				name
			}
		}
	}
}`

/**
 * GraphQL request to fetch collections. (paginated)
 */
export const collections = `
query getCollections($pageSize: Int!, $after: String){
	collections(first: $pageSize, after: $after) {
		edges {
			node {
				id
				handle
				title
				image {
				id
				url
				altText
				}
			}
			cursor
		}
	}
}`