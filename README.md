# @amplience/dc-demostore-integration

Amplience Demo Store Integration is a service written in Node.js that is intended to manage a number of different types of services, including but not limited to:

* commerce services

dc-demostore-integration uses codecs in order to determine how and where to get data from. The codecs required are configured in Amplience Dynamic Content as "Content" and not "Code".

## CommerceAPI

The `CommerceAPI` interface exposes these methods:

* `getProduct` (by ID or slug)
* `getProducts` (by IDs, by category or by search keyword)
* `getCategory` (by ID or slug)
* `getMegaMenu` (category hierarchy)
* `getCustomerGroups` (customer segmentation)

Concrete implementations of this interface are referred to as `Codec`s and are located in `src/codec/codecs`.

## Codecs in use

### `bigCommerceCodec`
Location: `src/codec/codecs/bigcommerce`

Schema: `https://demostore.amplience.com/site/integration/bigcommerce`

Connects to a BigCommerce instance.

#### Configuration

```
{
    "vendor": "bigcommerce",
    "api_url": "<bigcommerce api url>",
    "api_token": "<bigcommerce api token>",
    "store_hash": "<bigcommerce store hash>"
}
```

### `commerceToolsCodec`
Location: `src/codec/codecs/commercetools`

Schema: `https://demostore.amplience.com/site/integration/commercetools`

Connects to a commercetools instance.

#### Configuration

```
{
    "vendor": "commercetools",
    "project": "<ct project key>",
    "client_id": "<ct client id>",
    "client_secret": "<ct client secret>",
    "auth_url": "<ct auth url",
    "api_url": "<ct api url>",
    "scope": "<list of scopes>"
}
```

### `restCodec`
Location: `src/codec/codecs/rest`

Schema: `https://demostore.amplience.com/site/integration/rest`

Takes its product catalog, category structure, and translation data from URLs specified in its configuration.

#### Configuration

```
{
    "vendor": "rest",
    "productURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/products.json",
    "categoryURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/categories.json",
    "customerGroupURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/customerGroups.json",
    "translationsURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/translations.json"
}
```

### `sfccCodec`
Location: `src/codec/codecs/sfcc`

Schema: `https://demostore.amplience.com/site/integration/sfcc`

Connects to a SalesForce Commerce Cloud instance.

#### Configuration

```
{
    "vendor": "sfcc",
    "api_url": "<sfcc api url>",
    "auth_url": "<sfcc auth url>",
    "site_id": "<sfcc site id>",
    "client_id": "<sfcc client id>",
    "client_secret": "<sfcc site secret>"
}
```