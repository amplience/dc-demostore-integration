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
	  },
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

export const productById = `
query getProductById($id: ID!) {
	product(id: $id) {
${productShared}
	}
}`

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

export const segments = `
query getSegments($pageSize: Int!, $after: String) {
	segments(first: $pageSize, after: $after) {
	  	edges {
			node {
				id
				name
				query
			}
	  	}
	}
}`