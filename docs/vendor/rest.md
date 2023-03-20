# Files

## `restCodec`
Location: `src/codec/codecs/rest`

Schema: `https://demostore.amplience.com/site/integration/rest`

Takes its product catalog, category structure, and translation data from URLs specified in its configuration.

### Configuration

``` json
{
    "vendor": "rest",
    "codec_params": {
        "productURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/products.json",
        "categoryURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/categories.json",
        "customerGroupURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/customerGroups.json",
        "translationsURL": "https://demostore-catalog.s3.us-east-2.amazonaws.com/translations.json"
    }
}
```