export const exampleCustomerGroups = [
    {
        id: "514502426912",
        name: "Customers who haven't purchased"
    },
    {
        id: "514502459680",
        name: "Customers who have purchased more than once"
    },
    {
        id: "514502492448",
        name: "Abandoned checkouts in the last 30 days"
    },
    {
        id: "514502525216",
        name: "Email subscribers"
    }
]

export const exampleCategoryTree = [
    {
        "id": "439038771488",
        "slug": "frontpage",
        "name": "Home page",
        "image": null,
        "children": [],
        "products": []
    },
    {
        "id": "439038804256",
        "slug": "automated-collection",
        "name": "Automated Collection",
        "image": null,
        "children": [],
        "products": []
    },
    {
        "id": "439038837024",
        "slug": "hydrogen",
        "name": "Hydrogen",
        "image": null,
        "children": [],
        "products": []
    }
]

export const exampleProduct = (id: string) => ({
    "id": id,
    "name": "The Hidden Snowboard",
    "slug": "the-hidden-snowboard",
    "categories": [
        {
            "id": "439038804256",
            "slug": "automated-collection",
            "name": "Automated Collection",
            "image": null,
            "children": [],
            "products": []
        }
    ],
    "variants": [
        {
            "sku": "gid://shopify/ProductVariant/44723493437728",
            "listPrice": "£749.95",
            "salePrice": "£749.95",
            "attributes": {
                "Title": "Default Title"
            },
            "images": [
                {
                    "id": "40866728378656",
                    "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1678879296",
                    "altText": "Hidden Snowboard"
                }
            ]
        }
    ],
    "shortDescription": "",
    "longDescription": ""
})

export const exampleCategoryProducts = {
    "id": "439038837024",
    "slug": "hydrogen",
    "name": "Hydrogen",
    "image": null,
    "children": [],
    "products": [
        {
            "id": "8170311581984",
            "name": "The Collection Snowboard: Liquid",
            "slug": "the-collection-snowboard-liquid",
            "categories": [
                {
                    "id": "439038804256",
                    "slug": "automated-collection",
                    "name": "Automated Collection",
                    "image": null,
                    "children": [],
                    "products": []
                },
                {
                    "id": "439038837024",
                    "slug": "hydrogen",
                    "name": "Hydrogen",
                    "image": null,
                    "children": [],
                    "products": []
                }
            ],
            "variants": [
                {
                    "sku": "gid://shopify/ProductVariant/44723493306656",
                    "listPrice": "£749.95",
                    "salePrice": "£749.95",
                    "attributes": {
                        "Title": "Default Title"
                    },
                    "images": [
                        {
                            "id": "40866728280352",
                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1678879295",
                            "altText": "The Collection Snowboard: Liquid"
                        }
                    ]
                }
            ],
            "shortDescription": "A snowboard that probably won't be solid for long.",
            "longDescription": "A snowboard that probably won't be solid for long."
        },
        {
            "id": "8170311549216",
            "name": "The Collection Snowboard: Oxygen",
            "slug": "the-collection-snowboard-oxygen",
            "categories": [
                {
                    "id": "439038837024",
                    "slug": "hydrogen",
                    "name": "Hydrogen",
                    "image": null,
                    "children": [],
                    "products": []
                }
            ],
            "variants": [
                {
                    "sku": "gid://shopify/ProductVariant/44723493241120",
                    "listPrice": "£1,025.00",
                    "salePrice": "£1,025.00",
                    "attributes": {
                        "Title": "Default Title"
                    },
                    "images": [
                        {
                            "id": "40866728214816",
                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_d624f226-0a89-4fe1-b333-0d1548b43c06.jpg?v=1678879295",
                            "altText": "The Collection Snowboard: Oxygen"
                        }
                    ]
                }
            ],
            "shortDescription": "A snowboard that is as light as air. Because it is air. It doesn't exist.",
            "longDescription": "A snowboard that is as light as air. Because it is air. It doesn't exist."
        },
        {
            "id": "8170311516448",
            "name": "The Collection Snowboard: Hydrogen",
            "slug": "the-collection-snowboard-hydrogen",
            "categories": [
                {
                    "id": "439038804256",
                    "slug": "automated-collection",
                    "name": "Automated Collection",
                    "image": null,
                    "children": [],
                    "products": []
                },
                {
                    "id": "439038837024",
                    "slug": "hydrogen",
                    "name": "Hydrogen",
                    "image": null,
                    "children": [],
                    "products": []
                }
            ],
            "variants": [
                {
                    "sku": "gid://shopify/ProductVariant/44723493273888",
                    "listPrice": "£600.00",
                    "salePrice": "£600.00",
                    "attributes": {
                        "Title": "Default Title"
                    },
                    "images": [
                        {
                            "id": "40866728247584",
                            "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main.jpg?v=1678879295",
                            "altText": "The Collection Snowboard: Hydrogen"
                        }
                    ]
                }
            ],
            "shortDescription": "Snowboard that might explode if you bring a match to it.",
            "longDescription": "Snowboard that might explode if you bring a match to it."
        }
    ]
}

export const exampleProductsByKeyword = [
    {
        "id": "8170311418144",
        "name": "The 3p Fulfilled Snowboard",
        "slug": "the-3p-fulfilled-snowboard",
        "categories": [],
        "variants": [
            {
                "sku": "sku-hosted-1",
                "listPrice": "£2,629.95",
                "salePrice": "£2,629.95",
                "attributes": {
                    "Title": "Default Title"
                },
                "images": [
                    {
                        "id": "40866728116512",
                        "url": "https://cdn.shopify.com/s/files/1/0732/0289/3088/products/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg?v=1678879294",
                        "altText": "The Third-party fulfilled Snowboard"
                    }
                ]
            }
        ],
        "shortDescription": "A snowboard that will leave you fulfilled. TITLE",
        "longDescription": "A snowboard that will leave you fulfilled. TITLE"
    }
]