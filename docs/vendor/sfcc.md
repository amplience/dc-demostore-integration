# Salesforce Commerce Cloud

## `sfccCodec`

Location: `src/codec/codecs/sfcc`

Schema: `https://demostore.amplience.com/site/integration/sfcc`

Connects to a Salesforce Commerce Cloud instance.

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

The SFCC implementation makes OCAPI calls to an SFCC instance.

In order to allow dc-demostore-integration to access the Open Commerce API (OCAPI) on your Salesforce instance, create a new API client and add the client ID to this field. You can add a new API Client from the SFCC Account Manager.

When you create an API Client in the SFCC Account Manager, you will also specify an API Secret. See the [Setting up a Client ID](https://amplience.com/developers/docs/integrations/commerce/salesforce/setup/#ocapi-set-up) in SFCC section for more details.

As such, you'll need to edit the OCAPI settings, which can me found in Business Manager at Administration > Site Development > OCAPI Settings. These settings also handle whitelisting any URLs in the `allowed_origins` array.

> NOTE: The OCAPI Shop & Data endpoints in the following `resources` array covers the methods currently implemented by dc-demostore-integration. Additional methods may require adding additional resources in the OCAPI settings.

#### Admin > Site Development > OCAPI > Shop settings

```json
{
    "_v": "21.3",
    "clients": [
        {
            "client_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "allowed_origins": ["https://your.urlhere.com"],
            "resources": [
                {
                    "resource_id": "/customers/*",
                    "methods": ["get", "patch"],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)"
                },
                {
                    "resource_id": "/customers/auth",
                    "methods": ["post", "delete"],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)"
                },
                {
                    "methods": ["get"],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)",
                    "resource_id": "/product_search"
                },
                {
                    "methods": ["get"],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)",
                    "resource_id": "/products/{id}"
                },
                {
                    "methods": ["get"],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)",
                    "resource_id": "/products/{id}/*"
                },
                {
                    "methods": ["get"],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)",
                    "resource_id": "/categories/{id}"
                }
            ]
        }
    ]
}
```

#### Admin > Site Development > OCAPI > Data settings

```json
{
   "_v": "21.3",
   "clients":
   [
      {
            "client_id": "aaaaaaaaaaaaaaaaaaaaaaaa",
            "allowed_origins": [
                "https://ecomm-toolkit.dc-demostore.com"
            ],
            "resources": [
                {
                    "methods": [
                        "post"
                    ],
                    "read_attributes": "(**)",
                    "write_attributes": "(**)",
                    "resource_id": "/product_search"
                },
                {
                    "methods": [
                        "get"
                    ],
                    "read_attributes": "(**)",
                    "resource_id": "/sites/{site_id}/customer_groups"
                }
            ]
        }
   ]
}
```
