"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = exports.segments = exports.productsByCategory = exports.productById = exports.productsByQuery = exports.productShared = void 0;
/**
 * GraphQL request to fetch product information (minimal set required for conversion).
 */
exports.productShared = `
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
	pageInfo {
		hasNextPage
		endCursor
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
	pageInfo {
		hasNextPage
		endCursor
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
	pageInfo {
		hasNextPage
		endCursor
	}
}
availableForSale
handle`;
/**
 * GraphQL request to fetch products by query. (paginated)
 */
exports.productsByQuery = `
query getProducts($pageSize: Int!, $query: String, $after: String){
	products(first: $pageSize, after: $after, query: $query) {
		edges {
			node {
				${exports.productShared}
			}
			cursor
		}
		pageInfo {
			hasNextPage
			endCursor
		}
	}
}`;
/**
 * GraphQL request to fetch a product by ID.
 */
exports.productById = `
query getProductById($id: ID!) {
	product(id: $id) {
		${exports.productShared}
	}
}`;
/**
 * GraphQL request to fetch products by category. (paginated)
 */
exports.productsByCategory = `
query getProductsByCategory($handle: String!, $pageSize: Int!, $after: String) {
	collection(handle: $handle) {
		products(first: $pageSize, after: $after) {
			edges {
				node {
					${exports.productShared}
				}
				cursor
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
}`;
/**
 * GraphQL request to fetch segments. (paginated)
 */
exports.segments = `
query getSegments($pageSize: Int!, $after: String) {
	segments(first: $pageSize, after: $after) {
		edges {
			node {
				id
				name
			}
			cursor
		}
		pageInfo {
			hasNextPage
			endCursor
		}
	}
}`;
/**
 * GraphQL request to fetch collections. (paginated)
 */
exports.collections = `
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
		pageInfo {
			hasNextPage
			endCursor
		}
	}
}`;
