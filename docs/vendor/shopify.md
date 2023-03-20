# Shopify

## `shopifyCodec`
Location: `src/codec/codecs/shopify`

Schema: `https://demostore.amplience.com/site/integration/shopify`

Connects to a Shopify instance.

### Configuration

```json
{
    "vendor": "shopify",
    "codec_params": {
        "access_token": "<storefront access token>",
        "admin_access_token": "<admin access token>",
        "version": "<api version, eg. 2023-01>",
        "site_id": "<shopify site id>"
    }
}
```

## Configuration on the vendor side

### White list domain for API access

### Access needed