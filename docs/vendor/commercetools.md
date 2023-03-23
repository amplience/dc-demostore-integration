# CommerceTools

## `commerceToolsCodec`
Location: `src/codec/codecs/commercetools`

Schema: `https://demostore.amplience.com/site/integration/commercetools`

Connects to a commercetools instance.

### Configuration

```json
{
    "vendor": "commercetools",
    "codec_params": {
        "project": "<ct project key>",
        "client_id": "<ct client id>",
        "client_secret": "<ct client secret>",
        "auth_url": "<ct auth url",
        "api_url": "<ct api url>",
        "scope": "<list of scopes>"
    }
}
```

## Configuration on the vendor side

Scopes:

- `Categories`
- `Customer groups`
- `Product Selections`
- `Products (published)`

![](../media/commercetoolsA.png)

Credentials:

![](../media/commercetoolsB.png)
