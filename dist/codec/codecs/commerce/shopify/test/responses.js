"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopifySegments = exports.shopifyCategories = exports.shopifyProduct = void 0;
exports.shopifyProduct = {};
exports.shopifyCategories = {};
exports.shopifySegments = {
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
};
