# @amplience/dc-demostore-integration

Amplience Demo Store Integration is a service written in Node.js that is intended to manage a number of different types of services, including but not limited to:

-   commerce services

dc-demostore-integration uses codecs in order to determine how and where to get data from. It currently supports getting e-commerce data from:

-   Commercetools
-   Big Commerce
-   Shopify
-   Salesforce Commerce Cloud
-   REST

## Pre-requisites

This extension was developed and tested with:

-   Node version `14.x`
-   NPM version `6.x`

## How to use ths service

Our E-comm Tooklkit is built using dc-demostore-integration as a middleware in Next.js.

## Features

The `CommerceAPI` interface exposes these methods:

-   `getProduct` (by ID or slug)
-   `getProducts` (by IDs or keyword)
-   `getCategory` (by ID or slug)
-   `getCategoryTree` (category structure)
-   `getCustomerGroups` (customer segmentation)

Concrete implementations of this interface are referred to as `Codec`s and are located in `src/codec/codecs`. Platform-specific e-commerce implementations are found in `src/codec/codecs/commerce`.

## Quick Start

## Architecture Diagram

## Vendor specific information

-   [Saleforce Commerce Cloud](./docs/vendor/sfcc.md)
-   [Shopify](./docs/vendor/shopify.md)
-   [BigCommerce](./docs/vendor/bigcommerce.md)
-   [CommerceTools](./docs/vendor/commercetools.md)
-   [Files](./docs/vendor/rest.md)

## Development

-   [Import into project](./docs/dev/import.md)
-   [Host the service](./docs/dev/host.md)
-   [Develop locally](./docs/dev/develop-locally.md)
-   [Modify an integration](./docs/dev/modify-integration.md)
-   [Add an integration](./docs/dev/add-integration.md)
-   [Unit testing guidelines](./docs/dev/unit-testing.md)
