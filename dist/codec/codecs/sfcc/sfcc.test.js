"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importStar(require("."));
const rest_mock_1 = require("../../../common/test/rest-mock");
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
const sfccSearchHit = (id, categorySlug) => ({
    "_type": "product_search_hit",
    "hit_type": "master",
    "link": `https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?start=0&count=200&refine_1=cgid%3D${categorySlug}&client_id=test-client`,
    "product_id": id,
    "product_name": "Product " + { id },
    "product_type": {
        "_type": "product_type",
        "master": true
    },
    "represented_product": {
        "_type": "product_ref",
        "id": id + 'ref',
        "link": `https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}ref?start=0&count=200&refine_1=cgid%3D${categorySlug}&client_id=test-client`
    }
});
const sfccProduct = (id) => ({
    "_v": "22.4",
    "_type": "product",
    "currency": "GBP",
    "id": id,
    "image_groups": [
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, , large",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, "
                },
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, , large",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, "
                }
            ],
            "view_type": "large"
        },
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, large",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                },
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, large",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                }
            ],
            "variation_attributes": [
                {
                    "_type": "variation_attribute",
                    "id": "color",
                    "values": [
                        {
                            "_type": "variation_attribute_value",
                            "value": "JJ6JUXX"
                        }
                    ]
                }
            ],
            "view_type": "large"
        },
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, , medium",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, "
                },
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, , medium",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, "
                }
            ],
            "view_type": "medium"
        },
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, medium",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.PZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                },
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, medium",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/medium/PG.10235834.JJ6JUXX.BZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                }
            ],
            "variation_attributes": [
                {
                    "_type": "variation_attribute",
                    "id": "color",
                    "values": [
                        {
                            "_type": "variation_attribute_value",
                            "value": "JJ6JUXX"
                        }
                    ]
                }
            ],
            "view_type": "medium"
        },
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, , small",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, "
                },
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, , small",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, "
                }
            ],
            "view_type": "small"
        },
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, small",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.PZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                },
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, small",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/small/PG.10235834.JJ6JUXX.BZ.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                }
            ],
            "variation_attributes": [
                {
                    "_type": "variation_attribute",
                    "id": "color",
                    "values": [
                        {
                            "_type": "variation_attribute_value",
                            "value": "JJ6JUXX"
                        }
                    ]
                }
            ],
            "view_type": "small"
        },
        {
            "_type": "image_group",
            "images": [
                {
                    "_type": "image",
                    "alt": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi, swatch",
                    "dis_base_link": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/swatch/PG.10235834.JJ6JUXX.CP.jpg",
                    "link": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/swatch/PG.10235834.JJ6JUXX.CP.jpg",
                    "title": "Short Sleeve Wrap Blouse with Tie Front, Slate Multi"
                }
            ],
            "variation_attributes": [
                {
                    "_type": "variation_attribute",
                    "id": "color",
                    "values": [
                        {
                            "_type": "variation_attribute_value",
                            "value": "JJ6JUXX"
                        }
                    ]
                }
            ],
            "view_type": "swatch"
        }
    ],
    "long_description": "This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!",
    "master": {
        "_type": "master",
        "link": `https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?all_images=true&client_id=test-client`,
        "master_id": id,
        "price": 69.76
    },
    "min_order_quantity": 1,
    "name": "Short Sleeve Wrap Blouse with Tie Front",
    "page_description": "This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!",
    "page_title": "Short Sleeve Wrap Blouse with Tie Front",
    "price": 69.76,
    "price_per_unit": 69.76,
    "primary_category_id": "womens-clothing-tops",
    "short_description": "This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!",
    "step_quantity": 1,
    "type": {
        "_type": "product_type",
        "master": true
    },
    "valid_from": {
        "default": "2011-02-09T05:00:00.000Z"
    },
    "variants": [
        {
            "_type": "variant",
            "link": "https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/701644053093M?all_images=true&client_id=test-client",
            "price": 69.76,
            "product_id": "701644053093M",
            "variation_values": {
                "color": "JJ6JUXX",
                "size": "016"
            }
        },
        {
            "_type": "variant",
            "link": "https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/701644053079M?all_images=true&client_id=test-client",
            "price": 69.76,
            "product_id": "701644053079M",
            "variation_values": {
                "color": "JJ6JUXX",
                "size": "012"
            }
        },
        {
            "_type": "variant",
            "link": "https://test.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/701644053086M?all_images=true&client_id=test-client",
            "price": 69.76,
            "product_id": "701644053086M",
            "variation_values": {
                "color": "JJ6JUXX",
                "size": "014"
            }
        }
    ],
    "variation_attributes": [
        {
            "_type": "variation_attribute",
            "id": "color",
            "name": "Color",
            "values": [
                {
                    "_type": "variation_attribute_value",
                    "name": "Slate Multi",
                    "orderable": true,
                    "value": "JJ6JUXX"
                }
            ]
        },
        {
            "_type": "variation_attribute",
            "id": "size",
            "name": "Size",
            "values": [
                {
                    "_type": "variation_attribute_value",
                    "name": "12",
                    "orderable": true,
                    "value": "012"
                },
                {
                    "_type": "variation_attribute_value",
                    "name": "14",
                    "orderable": true,
                    "value": "014"
                },
                {
                    "_type": "variation_attribute_value",
                    "name": "16",
                    "orderable": true,
                    "value": "016"
                }
            ]
        }
    ]
});
const sfccProducts = (prefix, total) => {
    const result = {};
    for (let i = 0; i < total; i++) {
        result[`https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${prefix + i}`] = {
            data: sfccProduct(prefix + i)
        };
    }
    return result;
};
const sfccSearchResult = (total, pageSize, pageNumber, categorySlug) => {
    const pageBase = pageNumber * pageSize;
    const count = Math.min(total - pageBase, pageSize);
    return {
        "_v": "22.4",
        "_type": "product_search_result",
        "count": count,
        "hits": Array.from({ length: count }).map((_, index) => sfccSearchHit('Hit' + (pageBase + index), categorySlug)),
        "refinements": [
            {
                "_type": "product_search_refinement",
                "attribute_id": "cgid",
                "label": "Category",
                "values": [
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": total,
                        "label": "New Arrivals",
                        "value": "newarrivals",
                        "values": [
                            {
                                "_type": "product_search_refinement_value",
                                "hit_count": total,
                                "label": "Womens",
                                "value": "newarrivals-womens"
                            }
                        ]
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": total,
                        "label": "Womens",
                        "value": "womens"
                    }
                ]
            },
            {
                "_type": "product_search_refinement",
                "attribute_id": "c_refinementColor",
                "label": "Colour",
                "values": [
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 10),
                        "label": "Beige",
                        "presentation_id": "beige",
                        "value": "Beige"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 2),
                        "label": "Black",
                        "presentation_id": "black",
                        "value": "Black"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 4),
                        "label": "Blue",
                        "presentation_id": "blue",
                        "value": "Blue"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": 0,
                        "label": "Navy",
                        "presentation_id": "navy",
                        "value": "Navy"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 5),
                        "label": "Brown",
                        "presentation_id": "brown",
                        "value": "Brown"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 12),
                        "label": "Green",
                        "presentation_id": "green",
                        "value": "Green"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 7),
                        "label": "Grey",
                        "presentation_id": "grey",
                        "value": "Grey"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": 1,
                        "label": "Orange",
                        "presentation_id": "orange",
                        "value": "Orange"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 11),
                        "label": "Pink",
                        "presentation_id": "pink",
                        "value": "Pink"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 90),
                        "label": "Purple",
                        "presentation_id": "purple",
                        "value": "Purple"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": 1,
                        "label": "Red",
                        "presentation_id": "red",
                        "value": "Red"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 4),
                        "label": "White",
                        "presentation_id": "white",
                        "value": "White"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 20),
                        "label": "Yellow",
                        "presentation_id": "yellow",
                        "value": "Yellow"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 15),
                        "label": "Miscellaneous",
                        "presentation_id": "miscellaneous",
                        "value": "Miscellaneous"
                    }
                ]
            },
            {
                "_type": "product_search_refinement",
                "attribute_id": "price",
                "label": "Price",
                "values": [
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 30),
                        "label": "£0 - £19.99",
                        "value": "(0..20)"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 2),
                        "label": "£20 - £49.99",
                        "value": "(20..50)"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 3),
                        "label": "£50 - £99.99",
                        "value": "(50..100)"
                    },
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": 1,
                        "label": "£100 - £499.00",
                        "value": "(100..500)"
                    }
                ]
            },
            {
                "_type": "product_search_refinement",
                "attribute_id": "c_isNew",
                "label": "New Arrival",
                "values": [
                    {
                        "_type": "product_search_refinement_value",
                        "hit_count": Math.ceil(total / 18),
                        "label": "true",
                        "value": "true"
                    }
                ]
            },
            {
                "_type": "product_search_refinement",
                "attribute_id": "c_sheets",
                "label": "bySheets"
            }
        ],
        "search_phrase_suggestions": {
            "_type": "suggestion"
        },
        "selected_refinements": {
            "cgid": categorySlug
        },
        "sorting_options": [
            {
                "_type": "product_search_sorting_option",
                "id": "best-matches",
                "label": "Best Matches"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "price-low-to-high",
                "label": "Price Low To High"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "price-high-to-low",
                "label": "Price High to Low"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "product-name-ascending",
                "label": "Product Name A - Z"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "product-name-descending",
                "label": "Product Name Z - A"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "brand",
                "label": "Brand"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "most-popular",
                "label": "Most Popular"
            },
            {
                "_type": "product_search_sorting_option",
                "id": "top-sellers",
                "label": "Top Sellers"
            }
        ],
        "start": pageBase,
        "total": total
    };
};
const sfccRequests = {
    get: Object.assign(Object.assign({ 'https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/categories/root': {
            data: {
                "_v": "22.4",
                "_type": "category",
                "categories": [
                    {
                        "_type": "category",
                        "id": "content-link",
                        "name": "Content",
                        "parent_category_id": "root",
                        "parent_category_tree": [
                            {
                                "_type": "path_record",
                                "id": "content-link",
                                "name": "Content"
                            }
                        ],
                        "c_alternativeUrl": "https://test.dx.commercecloud.salesforce.com/s/TestSite/alt-urls/alt-urls.html?lang=default",
                        "c_enableCompare": false,
                        "c_showInMenu": true
                    },
                    {
                        "_type": "category",
                        "categories": [
                            {
                                "_type": "category",
                                "id": "newarrivals-womens",
                                "image": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/sub_banners/cat-banner-womens-clothing.jpg",
                                "name": "Womens",
                                "page_description": "New Arrivals in womens fashionable and stylish Shoes, jackets and  all other clothing for unbeatable comfort day in, day out. Practical and fashionable styles wherever the occasion.",
                                "page_title": "New Arrivals in Women's Footwear, Outerwear, Clothing & Accessories",
                                "parent_category_id": "newarrivals",
                                "parent_category_tree": [
                                    {
                                        "_type": "path_record",
                                        "id": "newarrivals",
                                        "name": "New Arrivals"
                                    },
                                    {
                                        "_type": "path_record",
                                        "id": "newarrivals-womens",
                                        "name": "Womens"
                                    }
                                ],
                                "c_enableCompare": false,
                                "c_showInMenu": true,
                                "c_slotBannerImage": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/landing/cat-landing-slotbottom-womens-clothing.jpg"
                            },
                            {
                                "_type": "category",
                                "id": "newarrivals-mens",
                                "image": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/sub_banners/cat-banner-mens-clothing.jpg",
                                "name": "Mens",
                                "page_description": "New Arrivals in Mens  jackets and clothing for unbeatable comfort day in, day out. Practical, easy-to-wear styles wherever you're headed.",
                                "page_title": "New Arrivals in Men's Clothing, Suits & Accessories",
                                "parent_category_id": "newarrivals",
                                "parent_category_tree": [
                                    {
                                        "_type": "path_record",
                                        "id": "newarrivals",
                                        "name": "New Arrivals"
                                    },
                                    {
                                        "_type": "path_record",
                                        "id": "newarrivals-mens",
                                        "name": "Mens"
                                    }
                                ],
                                "c_enableCompare": false,
                                "c_showInMenu": true,
                                "c_slotBannerImage": "https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/landing/cat-landing-slotbottom-mens-dressshirts.jpg"
                            }
                        ],
                        "id": "newarrivals",
                        "name": "New Arrivals",
                        "page_description": "Shop all new arrivals including women and mens clothing, jewelry, accessories, suits & more at Test Site",
                        "page_title": "Women and Mens New Arrivals in Clothing, Jewelry, Accessories & More",
                        "parent_category_id": "root",
                        "parent_category_tree": [
                            {
                                "_type": "path_record",
                                "id": "newarrivals",
                                "name": "New Arrivals"
                            }
                        ],
                        "c_enableCompare": false,
                        "c_headerMenuBanner": "<img alt=\"New Arrivals Image\" src=\"https://test.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-storefront-catalog-m-non-en/default/aaaaaaaaaa/images/slot/landing/cat-landing-slotbottom-womens-clothing.jpg\" width=\"225\" />",
                        "c_headerMenuOrientation": "Vertical",
                        "c_showInMenu": true
                    },
                ],
                "id": "root",
                "name": "Storefront Catalog - Non-EN"
            }
        }, "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/ExampleID": {
            data: sfccProduct('ExampleID')
        }, "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/ExampleID2": {
            data: sfccProduct('ExampleID2')
        } }, sfccProducts('Hit', 300)), { "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=0&count=200": {
            data: sfccSearchResult(300, 200, 0, 'newarrivals-womens')
        }, "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/product_search?refine_1=cgid%3Dnewarrivals-womens&start=200&count=200": {
            data: sfccSearchResult(300, 200, 1, 'newarrivals-womens')
        }, "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000": {
            // TODO: needs auth
            data: {
                "_v": "22.4",
                "_type": "customer_groups",
                "count": 14,
                "data": [
                    {
                        "_type": "customer_group",
                        "_resource_state": "ee0d20ef5a728803964e7982e6de8fdf67452619cdc4ead52bcae054b16d544f",
                        "id": "Big Spenders",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Big%20Spenders"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "4c4e70e4823a82f4af20788714792ed9210bda00628de07afcb6fa87da381f23",
                        "id": "Everyone",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Everyone"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "8d26ba06c4252693b75185c92d16e75906b1c5cd7aee05f7df818681440b2a3a",
                        "id": "Registered",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Registered"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "76b7ac8e878e535be89a0527b3de6efe187f01df6ebd9026a75360ac97d3dcb2",
                        "id": "TestStaticCustomerGroup",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/TestStaticCustomerGroup"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "d23629250f7a6abd90538277a19aa4b73dd4dc897ae1c57c82ae3aff50772f12",
                        "id": "Unregistered",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Unregistered"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "d059a7334e8e1e03fc5f540e0ce534c7dfd71752c38b30ceb8309f04f716d7b6",
                        "id": "female",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/female"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "d9ffc388d68fc3402bb967d8ce12ea69e8de0eae65b8e313ef98263af1629f50",
                        "id": "genY",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/genY"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "e4d67c208d577d8502dba70c9a932625bc771c0a460a3020bed437617b217949",
                        "id": "genZ",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/genZ"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "4de0fbcdbd0a72849599a543f230c3c119ac9e613bc724ce7f2fb10bfeaa207f",
                        "id": "genx",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/genx"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "e157d894c63ce69a8e9d44a50d472a632b843bdbec3b31dde57d5473021c6b9f",
                        "id": "male",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/male"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "0128a0c09171606bf18e02edf0ff4b8eea96fa7d8e184046c72841cc2d1dbb50",
                        "id": "spookygroup",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/spookygroup"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "13ed80af7488493f3e201fb88d3fada296535a1c6fd17bdaa2e6b760e279d606",
                        "id": "spookygroupregistered",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/spookygroupregistered"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "9c58e88489cb0302d260ba6cdefd8421ad3217b896b19dc5ddff0c083de1f445",
                        "id": "testgroup",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/testgroup"
                    },
                    {
                        "_type": "customer_group",
                        "_resource_state": "6518191371fdf3ac0435e23497e2dce53089643014312545f43fdfd1ea8fdb8b",
                        "id": "testgroup2",
                        "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/testgroup2"
                    }
                ],
                "start": 0,
                "total": 14
            }
        } }),
    post: {
        "https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials": {
            data: {
                "access_token": "token",
                "scope": "mail tenantFilter profile",
                "token_type": "Bearer",
                "expires_in": 1799
            }
        }
    }
};
const sfccConfig = {
    vendor: 'sfcc',
    api_url: 'https://test.sandbox.us03.dx.commercecloud.salesforce.com',
    auth_url: 'https://account.demandware.com/dwsso/oauth2/access_token',
    client_id: 'test-client',
    client_secret: 'test-secret',
    site_id: 'TestSite'
};
const categoryRequest = {
    "config": {
        "baseURL": "https://test.sandbox.us03.dx.commercecloud.salesforce.com",
        "params": {
            "client_id": "test-client",
        },
        "url": "/s/TestSite/dw/shop/v22_4/categories/root?levels=4",
    },
    "url": "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/categories/root?levels=4"
};
const productIdRequest = (id) => ({
    "config": {
        "baseURL": "https://test.sandbox.us03.dx.commercecloud.salesforce.com",
        "params": {
            "client_id": "test-client",
        },
        "url": `/s/TestSite/dw/shop/v22_4/products/${id}?expand=prices,options,images,variations&all_images=true`,
    },
    "url": `https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/TestSite/dw/shop/v22_4/products/${id}?expand=prices,options,images,variations&all_images=true`,
});
const oauthRequest = {
    config: {
        url: "https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials"
    },
    url: "https://account.demandware.com/dwsso/oauth2/access_token?grant_type=client_credentials"
};
const customerGroupsRequest = {
    "config": {
        "method": "GET",
        "baseURL": "https://test.sandbox.us03.dx.commercecloud.salesforce.com",
        "headers": {
            "Authorization": "Bearer token",
        },
        "url": "/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000",
    },
    "url": "https://test.sandbox.us03.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/TestSite/customer_groups?start=0&count=1000"
};
const productIdRequests = (id, total) => Array.from({ length: total }).map((_, index) => productIdRequest(id + index));
const exampleProduct = (id) => ({
    "categories": [],
    "id": id,
    "longDescription": "This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!",
    "name": "Short Sleeve Wrap Blouse with Tie Front",
    "shortDescription": "This short sleeve wrap blouse with tie front is a show stopper on its own or pair under a jacket for an amazing look!",
    "slug": "short-sleeve-wrap-blouse-with-tie-front",
    "variants": [
        {
            "attributes": {
                "color": "JJ6JUXX",
                "size": "016",
            },
            "images": [
                {
                    "url": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                },
                {
                    "url": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                },
            ],
            "listPrice": "£69.76",
            "salePrice": "£69.76",
            "sku": "701644053093M",
        },
        {
            "attributes": {
                "color": "JJ6JUXX",
                "size": "012",
            },
            "images": [
                {
                    "url": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                },
                {
                    "url": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                },
            ],
            "listPrice": "£69.76",
            "salePrice": "£69.76",
            "sku": "701644053079M",
        },
        {
            "attributes": {
                "color": "JJ6JUXX",
                "size": "014",
            },
            "images": [
                {
                    "url": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.PZ.jpg",
                },
                {
                    "url": "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/TEST/on/demandware.static/-/Sites-apparel-m-catalog/default/aaaaaaaaaa/images/large/PG.10235834.JJ6JUXX.BZ.jpg",
                },
            ],
            "listPrice": "£69.76",
            "salePrice": "£69.76",
            "sku": "701644053086M",
        },
    ],
});
describe('sfcc integration', function () {
    let sfccCodec;
    let requests;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        jest.resetAllMocks();
        requests = [];
        (0, rest_mock_1.massMock)(axios_1.default, requests, sfccRequests);
        sfccCodec = new _1.SFCCCommerceCodec(sfccConfig);
        yield sfccCodec.init(new _1.default());
    }));
    test('getProduct', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProduct({
            id: 'ExampleID'
        });
        expect(requests).toEqual([
            categoryRequest,
            productIdRequest('ExampleID')
        ]);
        expect(result).toEqual(exampleProduct('ExampleID'));
    }));
    test('getProducts (multiple)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProducts({
            productIds: 'ExampleID,ExampleID2'
        });
        expect(requests).toEqual([
            categoryRequest,
            productIdRequest('ExampleID'),
            productIdRequest('ExampleID2')
        ]);
        expect(result).toEqual([
            exampleProduct('ExampleID'),
            exampleProduct('ExampleID2')
        ]);
    }));
    test('getProducts (keyword)', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getProducts({
            keyword: 'Hit'
        });
        expect(requests).toEqual([
            categoryRequest,
            productIdRequest('ExampleID'),
            productIdRequest('ExampleID2')
        ]);
        expect(result).toEqual([
            exampleProduct('ExampleID'),
            exampleProduct('ExampleID2')
        ]);
    }));
    test('getProducts (category)', () => __awaiter(this, void 0, void 0, function* () {
        const products = yield sfccCodec.getProducts({ category: {
                children: [],
                products: [],
                id: "newarrivals-womens",
                name: "Womens",
                slug: "newarrivals-womens",
            } });
        expect(requests).toEqual([
            categoryRequest,
            productIdRequests('Hit', 300)
        ]);
        expect(products.length).toEqual(300);
        expect(products).toEqual(Array.from({ length: 300 }).map((_, index) => exampleProduct('Hit' + index)));
    }));
    test('getProduct (missing)', () => __awaiter(this, void 0, void 0, function* () {
        expect(sfccCodec.getProduct({
            id: 'MissingID'
        })).rejects.toMatchInlineSnapshot(`
{
  "config": {
    "baseURL": "https://test.sandbox.us03.dx.commercecloud.salesforce.com",
    "params": {
      "client_id": "test-client",
    },
    "url": "/s/TestSite/dw/shop/v22_4/products/MissingID?expand=prices,options,images,variations&all_images=true",
  },
  "data": {},
  "headers": {},
  "status": 404,
  "statusText": "Not Found",
}
`);
        expect(requests).toEqual([
            categoryRequest,
            productIdRequest('MissingID')
        ]);
    }));
    test('getRawProducts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield sfccCodec.getRawProducts({
            productIds: 'ExampleID'
        });
        expect(requests).toEqual([
            categoryRequest,
            productIdRequest('ExampleID')
        ]);
        expect(result).toEqual([sfccProduct('ExampleID')]);
    }));
    test('getCategory', () => __awaiter(this, void 0, void 0, function* () {
        const category = yield sfccCodec.getCategory({ slug: 'newarrivals-womens' });
        expect(requests).toEqual([
            categoryRequest,
            productIdRequests('Hit', 300)
        ]);
        expect(category.products.length).toEqual(300);
        expect(category).toEqual({
            children: [],
            products: Array.from({ length: 300 }).map((_, index) => exampleProduct('Hit' + index)),
            id: "newarrivals-womens",
            name: "Womens",
            slug: "newarrivals-womens",
        });
    }));
    test('getMegaMenu', () => __awaiter(this, void 0, void 0, function* () {
        const megaMenu = yield sfccCodec.getMegaMenu({});
        expect(requests).toEqual([
            categoryRequest,
        ]);
        expect(megaMenu).toMatchInlineSnapshot(`
[
  {
    "children": [],
    "id": "content-link",
    "name": "Content",
    "products": [],
    "slug": "content-link",
  },
  {
    "children": [
      {
        "children": [],
        "id": "newarrivals-womens",
        "name": "Womens",
        "products": [],
        "slug": "newarrivals-womens",
      },
      {
        "children": [],
        "id": "newarrivals-mens",
        "name": "Mens",
        "products": [],
        "slug": "newarrivals-mens",
      },
    ],
    "id": "newarrivals",
    "name": "New Arrivals",
    "products": [],
    "slug": "newarrivals",
  },
]
`);
    }));
    test('getCustomerGroups', () => __awaiter(this, void 0, void 0, function* () {
        const customerGroups = yield sfccCodec.getCustomerGroups({});
        expect(customerGroups).toMatchInlineSnapshot(`
[
  {
    "_resource_state": "ee0d20ef5a728803964e7982e6de8fdf67452619cdc4ead52bcae054b16d544f",
    "_type": "customer_group",
    "id": "Big Spenders",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Big%20Spenders",
    "name": "Big Spenders",
  },
  {
    "_resource_state": "4c4e70e4823a82f4af20788714792ed9210bda00628de07afcb6fa87da381f23",
    "_type": "customer_group",
    "id": "Everyone",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Everyone",
    "name": "Everyone",
  },
  {
    "_resource_state": "8d26ba06c4252693b75185c92d16e75906b1c5cd7aee05f7df818681440b2a3a",
    "_type": "customer_group",
    "id": "Registered",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Registered",
    "name": "Registered",
  },
  {
    "_resource_state": "76b7ac8e878e535be89a0527b3de6efe187f01df6ebd9026a75360ac97d3dcb2",
    "_type": "customer_group",
    "id": "TestStaticCustomerGroup",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/TestStaticCustomerGroup",
    "name": "TestStaticCustomerGroup",
  },
  {
    "_resource_state": "d23629250f7a6abd90538277a19aa4b73dd4dc897ae1c57c82ae3aff50772f12",
    "_type": "customer_group",
    "id": "Unregistered",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/Unregistered",
    "name": "Unregistered",
  },
  {
    "_resource_state": "d059a7334e8e1e03fc5f540e0ce534c7dfd71752c38b30ceb8309f04f716d7b6",
    "_type": "customer_group",
    "id": "female",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/female",
    "name": "female",
  },
  {
    "_resource_state": "d9ffc388d68fc3402bb967d8ce12ea69e8de0eae65b8e313ef98263af1629f50",
    "_type": "customer_group",
    "id": "genY",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/genY",
    "name": "genY",
  },
  {
    "_resource_state": "e4d67c208d577d8502dba70c9a932625bc771c0a460a3020bed437617b217949",
    "_type": "customer_group",
    "id": "genZ",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/genZ",
    "name": "genZ",
  },
  {
    "_resource_state": "4de0fbcdbd0a72849599a543f230c3c119ac9e613bc724ce7f2fb10bfeaa207f",
    "_type": "customer_group",
    "id": "genx",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/genx",
    "name": "genx",
  },
  {
    "_resource_state": "e157d894c63ce69a8e9d44a50d472a632b843bdbec3b31dde57d5473021c6b9f",
    "_type": "customer_group",
    "id": "male",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/male",
    "name": "male",
  },
  {
    "_resource_state": "0128a0c09171606bf18e02edf0ff4b8eea96fa7d8e184046c72841cc2d1dbb50",
    "_type": "customer_group",
    "id": "spookygroup",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/spookygroup",
    "name": "spookygroup",
  },
  {
    "_resource_state": "13ed80af7488493f3e201fb88d3fada296535a1c6fd17bdaa2e6b760e279d606",
    "_type": "customer_group",
    "id": "spookygroupregistered",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/spookygroupregistered",
    "name": "spookygroupregistered",
  },
  {
    "_resource_state": "9c58e88489cb0302d260ba6cdefd8421ad3217b896b19dc5ddff0c083de1f445",
    "_type": "customer_group",
    "id": "testgroup",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/testgroup",
    "name": "testgroup",
  },
  {
    "_resource_state": "6518191371fdf3ac0435e23497e2dce53089643014312545f43fdfd1ea8fdb8b",
    "_type": "customer_group",
    "id": "testgroup2",
    "link": "https://zzfr-002.dx.commercecloud.salesforce.com/s/-/dw/data/v22_4/sites/RefArchGlobal/customer_groups/testgroup2",
    "name": "testgroup2",
  },
]
`);
        expect(requests).toEqual([
            categoryRequest,
            oauthRequest,
            customerGroupsRequest
        ]);
    }));
});
