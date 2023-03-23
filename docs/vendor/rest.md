# Files

## `restCodec`

Location: `src/codec/codecs/rest`

Schema: `https://demostore.amplience.com/site/integration/rest`

To clarify, the rest "endpoints" are included here as **sample JSON data**, and not as a full-fledged REST API. They are provided for testing and automation purposes and also if you do not have access to an e-commerce platform, but still want to experiment with some sample data.

The data takes its product catalog, category structure, and translation data from URLs specified in its configuration, meaning that you can also point to sample JSON data (or even a real REST API) of your own.

Of course, if you point to a real REST API you'll need to implement an auth of some kind and incorporate that into the codec settings.

### Configuration

```json
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
