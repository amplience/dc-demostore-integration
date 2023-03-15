"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsByCategory = exports.productById = exports.productsByQuery = exports.productShared = void 0;
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
handle`;
exports.productsByQuery = `
query getProducts($pageSize: Int!, $query: String, $after: String){
  products(first: $pageSize, after: $after, query: $query) {
    edges {
      node {
${exports.productShared}
      }
      cursor
    }
  }
}`;
exports.productById = `
query getProductById($id: ID!) {
	product(id: $id) {
${exports.productShared}
	}
}`;
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
    }
  }
}`;
