# SalesForce Commerce Cloud

## `sfccCodec`
Location: `src/codec/codecs/sfcc`

Schema: `https://demostore.amplience.com/site/integration/sfcc`

Connects to a SalesForce Commerce Cloud instance.

### Configuration

```json
{
    "vendor": "sfcc",
    "codec_params": {
        "api_url": "<sfcc api url>",
        "auth_url": "<sfcc auth url>",
        "site_id": "<sfcc site id>",
        "client_id": "<sfcc client id>",
        "client_secret": "<sfcc site secret>"
    }
}
```

## Configuration on the vendor side

### White list domain for API access

### Access needed