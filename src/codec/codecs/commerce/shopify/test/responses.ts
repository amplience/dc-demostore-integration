export const shopifyProduct = (id: string) => ({
    "data": {
        "product": {
            "id": id,
            "title": "The Hidden Snowboard",
            "description": "",
            "collections": {
                "edges": [
                    {
                        "node": {
                            "id": "gid://shopify/Collection/439038804256",
                            "handle": "automated-collection",
                            "title": "Automated Collection",
                            "image": null
                        },
                        "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MDQyNTYsImxhc3RfdmFsdWUiOjQzOTAzODgwNDI1Nn0="
                    }
                ]
            },
            "tags": [
                "Premium",
                "Snow",
                "Snowboard",
                "Sport",
                "Winter"
            ],
            "variants": {
                "edges": [
                    {
                        "node": {
                            "id": "gid://shopify/ProductVariant/44723493437728",
                            "title": "Default Title",
                            "sku": "",
                            "selectedOptions": [
                                {
                                    "name": "Title",
                                    "value": "Default Title"
                                }
                            ],
                            "price": {
                                "currencyCode": "GBP",
                                "amount": "749.95"
                            },
                            "unitPrice": null,
                            "compareAtPrice": null,
                            "image": {
                                "id": "gid://shopify/ProductImage/40866728378656",
                                "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1678879296",
                                "altText": "Hidden Snowboard"
                            }
                        },
                        "cursor": "eyJsYXN0X2lkIjo0NDcyMzQ5MzQzNzcyOCwibGFzdF92YWx1ZSI6MX0="
                    }
                ]
            },
            "images": {
                "edges": [
                    {
                        "node": {
                            "id": "gid://shopify/ProductImage/40866728378656",
                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1678879296",
                            "altText": "Hidden Snowboard"
                        },
                        "cursor": "eyJsYXN0X2lkIjo0MDg2NjcyODM3ODY1NiwibGFzdF92YWx1ZSI6MX0="
                    }
                ]
            },
            "availableForSale": true,
            "handle": "the-hidden-snowboard"
        }
    }
})

export const shopifyCategories = {
    "data": {
        "collections": {
            "edges": [
                {
                    "node": {
                        "id": "gid://shopify/Collection/439038771488",
                        "handle": "frontpage",
                        "title": "Home page",
                        "image": null
                    },
                    "cursor": "eyJsYXN0X2lkIjo0MzkwMzg3NzE0ODgsImxhc3RfdmFsdWUiOjQzOTAzODc3MTQ4OH0="
                },
                {
                    "node": {
                        "id": "gid://shopify/Collection/439038804256",
                        "handle": "automated-collection",
                        "title": "Automated Collection",
                        "image": null
                    },
                    "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MDQyNTYsImxhc3RfdmFsdWUiOjQzOTAzODgwNDI1Nn0="
                },
                {
                    "node": {
                        "id": "gid://shopify/Collection/439038837024",
                        "handle": "hydrogen",
                        "title": "Hydrogen",
                        "image": null
                    },
                    "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MzcwMjQsImxhc3RfdmFsdWUiOjQzOTAzODgzNzAyNH0="
                }
            ]
        }
    }
}

export const shopifyCategoryProducts = {
    "data": {
        "collection": {
            "products": {
                "edges": [
                    {
                        "node": {
                            "id": "gid://shopify/Product/8170311581984",
                            "title": "The Collection Snowboard: Liquid",
                            "description": "A snowboard that probably won't be solid for long.",
                            "collections": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/Collection/439038804256",
                                            "handle": "automated-collection",
                                            "title": "Automated Collection",
                                            "image": null
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MDQyNTYsImxhc3RfdmFsdWUiOjQzOTAzODgwNDI1Nn0="
                                    },
                                    {
                                        "node": {
                                            "id": "gid://shopify/Collection/439038837024",
                                            "handle": "hydrogen",
                                            "title": "Hydrogen",
                                            "image": null
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MzcwMjQsImxhc3RfdmFsdWUiOjQzOTAzODgzNzAyNH0="
                                    }
                                ]
                            },
                            "tags": [
                                "Accessory",
                                "Sport",
                                "Winter"
                            ],
                            "variants": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/ProductVariant/44723493306656",
                                            "title": "Default Title",
                                            "sku": "",
                                            "selectedOptions": [
                                                {
                                                    "name": "Title",
                                                    "value": "Default Title"
                                                }
                                            ],
                                            "price": {
                                                "currencyCode": "GBP",
                                                "amount": "749.95"
                                            },
                                            "unitPrice": null,
                                            "compareAtPrice": null,
                                            "image": {
                                                "id": "gid://shopify/ProductImage/40866728280352",
                                                "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1678879295",
                                                "altText": "The Collection Snowboard: Liquid"
                                            }
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0NDcyMzQ5MzMwNjY1NiwibGFzdF92YWx1ZSI6MX0="
                                    }
                                ]
                            },
                            "images": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/ProductImage/40866728280352",
                                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1678879295",
                                            "altText": "The Collection Snowboard: Liquid"
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MDg2NjcyODI4MDM1MiwibGFzdF92YWx1ZSI6MX0="
                                    }
                                ]
                            },
                            "availableForSale": true,
                            "handle": "the-collection-snowboard-liquid"
                        },
                        "cursor": "eyJsYXN0X2lkIjo4MTcwMzExNTgxOTg0LCJsYXN0X3ZhbHVlIjowfQ=="
                    },
                    {
                        "node": {
                            "id": "gid://shopify/Product/8170311549216",
                            "title": "The Collection Snowboard: Oxygen",
                            "description": "A snowboard that is as light as air. Because it is air. It doesn't exist.",
                            "collections": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/Collection/439038837024",
                                            "handle": "hydrogen",
                                            "title": "Hydrogen",
                                            "image": null
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MzcwMjQsImxhc3RfdmFsdWUiOjQzOTAzODgzNzAyNH0="
                                    }
                                ]
                            },
                            "tags": [
                                "Accessory",
                                "Sport",
                                "Winter"
                            ],
                            "variants": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/ProductVariant/44723493241120",
                                            "title": "Default Title",
                                            "sku": "",
                                            "selectedOptions": [
                                                {
                                                    "name": "Title",
                                                    "value": "Default Title"
                                                }
                                            ],
                                            "price": {
                                                "currencyCode": "GBP",
                                                "amount": "1025.0"
                                            },
                                            "unitPrice": null,
                                            "compareAtPrice": null,
                                            "image": {
                                                "id": "gid://shopify/ProductImage/40866728214816",
                                                "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_d624f226-0a89-4fe1-b333-0d1548b43c06.jpg?v=1678879295",
                                                "altText": "The Collection Snowboard: Oxygen"
                                            }
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0NDcyMzQ5MzI0MTEyMCwibGFzdF92YWx1ZSI6MX0="
                                    }
                                ]
                            },
                            "images": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/ProductImage/40866728214816",
                                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_d624f226-0a89-4fe1-b333-0d1548b43c06.jpg?v=1678879295",
                                            "altText": "The Collection Snowboard: Oxygen"
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MDg2NjcyODIxNDgxNiwibGFzdF92YWx1ZSI6MX0="
                                    }
                                ]
                            },
                            "availableForSale": true,
                            "handle": "the-collection-snowboard-oxygen"
                        },
                        "cursor": "eyJsYXN0X2lkIjo4MTcwMzExNTQ5MjE2LCJsYXN0X3ZhbHVlIjowfQ=="
                    },
                    {
                        "node": {
                            "id": "gid://shopify/Product/8170311516448",
                            "title": "The Collection Snowboard: Hydrogen",
                            "description": "Snowboard that might explode if you bring a match to it.",
                            "collections": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/Collection/439038804256",
                                            "handle": "automated-collection",
                                            "title": "Automated Collection",
                                            "image": null
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MDQyNTYsImxhc3RfdmFsdWUiOjQzOTAzODgwNDI1Nn0="
                                    },
                                    {
                                        "node": {
                                            "id": "gid://shopify/Collection/439038837024",
                                            "handle": "hydrogen",
                                            "title": "Hydrogen",
                                            "image": null
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MzkwMzg4MzcwMjQsImxhc3RfdmFsdWUiOjQzOTAzODgzNzAyNH0="
                                    }
                                ]
                            },
                            "tags": [
                                "Accessory",
                                "Sport",
                                "Winter"
                            ],
                            "variants": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/ProductVariant/44723493273888",
                                            "title": "Default Title",
                                            "sku": "",
                                            "selectedOptions": [
                                                {
                                                    "name": "Title",
                                                    "value": "Default Title"
                                                }
                                            ],
                                            "price": {
                                                "currencyCode": "GBP",
                                                "amount": "600.0"
                                            },
                                            "unitPrice": null,
                                            "compareAtPrice": null,
                                            "image": {
                                                "id": "gid://shopify/ProductImage/40866728247584",
                                                "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main.jpg?v=1678879295",
                                                "altText": "The Collection Snowboard: Hydrogen"
                                            }
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0NDcyMzQ5MzI3Mzg4OCwibGFzdF92YWx1ZSI6MX0="
                                    }
                                ]
                            },
                            "images": {
                                "edges": [
                                    {
                                        "node": {
                                            "id": "gid://shopify/ProductImage/40866728247584",
                                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main.jpg?v=1678879295",
                                            "altText": "The Collection Snowboard: Hydrogen"
                                        },
                                        "cursor": "eyJsYXN0X2lkIjo0MDg2NjcyODI0NzU4NCwibGFzdF92YWx1ZSI6MX0="
                                    }
                                ]
                            },
                            "availableForSale": true,
                            "handle": "the-collection-snowboard-hydrogen"
                        },
                        "cursor": "eyJsYXN0X2lkIjo4MTcwMzExNTE2NDQ4LCJsYXN0X3ZhbHVlIjowfQ=="
                    }
                ]
            }
        }
    }
}

export const shopifySegments = {
    "data": {
        "segments": {
            "edges": [
                {
                    "node": {
                        "id": "gid://shopify/Segment/514502426912",
                        "name": "Customers who haven't purchased"
                    }
                },
                {
                    "node": {
                        "id": "gid://shopify/Segment/514502459680",
                        "name": "Customers who have purchased more than once"
                    }
                },
                {
                    "node": {
                        "id": "gid://shopify/Segment/514502492448",
                        "name": "Abandoned checkouts in the last 30 days"
                    }
                },
                {
                    "node": {
                        "id": "gid://shopify/Segment/514502525216",
                        "name": "Email subscribers"
                    }
                }
            ]
        }
    },
    "extensions": {
        "cost": {
            "requestedQueryCost": 102,
            "actualQueryCost": 6,
            "throttleStatus": {
                "maximumAvailable": 1000,
                "currentlyAvailable": 976,
                "restoreRate": 50
            }
        }
    }
}