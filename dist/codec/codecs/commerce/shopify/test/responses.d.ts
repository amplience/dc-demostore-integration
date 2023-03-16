export declare const shopifyProduct: (id: string) => {
    data: {
        product: {
            id: string;
            title: string;
            description: string;
            collections: {
                edges: {
                    node: {
                        id: string;
                        handle: string;
                        title: string;
                        image: any;
                    };
                    cursor: string;
                }[];
                pageInfo: {
                    hasNextPage: boolean;
                    endCursor: string;
                };
            };
            tags: string[];
            variants: {
                edges: {
                    node: {
                        id: string;
                        title: string;
                        sku: string;
                        selectedOptions: {
                            name: string;
                            value: string;
                        }[];
                        price: {
                            currencyCode: string;
                            amount: string;
                        };
                        unitPrice: any;
                        compareAtPrice: any;
                        image: {
                            id: string;
                            url: string;
                            altText: string;
                        };
                    };
                    cursor: string;
                }[];
                pageInfo: {
                    hasNextPage: boolean;
                    endCursor: string;
                };
            };
            images: {
                edges: {
                    node: {
                        id: string;
                        url: string;
                        altText: string;
                    };
                    cursor: string;
                }[];
                pageInfo: {
                    hasNextPage: boolean;
                    endCursor: string;
                };
            };
            availableForSale: boolean;
            handle: string;
        };
    };
};
export declare const shopifyCategories: {
    data: {
        collections: {
            edges: {
                node: {
                    id: string;
                    handle: string;
                    title: string;
                    image: any;
                };
                cursor: string;
            }[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
};
export declare const shopifyCategoryProducts: {
    data: {
        collection: {
            products: {
                pageInfo: {
                    hasNextPage: boolean;
                    endCursor: string;
                };
                edges: {
                    node: {
                        id: string;
                        title: string;
                        description: string;
                        collections: {
                            edges: {
                                node: {
                                    id: string;
                                    handle: string;
                                    title: string;
                                    image: any;
                                };
                                cursor: string;
                            }[];
                            pageInfo: {
                                hasNextPage: boolean;
                                endCursor: string;
                            };
                        };
                        tags: string[];
                        variants: {
                            edges: {
                                node: {
                                    id: string;
                                    title: string;
                                    sku: string;
                                    selectedOptions: {
                                        name: string;
                                        value: string;
                                    }[];
                                    price: {
                                        currencyCode: string;
                                        amount: string;
                                    };
                                    unitPrice: any;
                                    compareAtPrice: any;
                                    image: {
                                        id: string;
                                        url: string;
                                        altText: string;
                                    };
                                };
                                cursor: string;
                            }[];
                            pageInfo: {
                                hasNextPage: boolean;
                                endCursor: string;
                            };
                        };
                        images: {
                            edges: {
                                node: {
                                    id: string;
                                    url: string;
                                    altText: string;
                                };
                                cursor: string;
                            }[];
                            pageInfo: {
                                hasNextPage: boolean;
                                endCursor: string;
                            };
                        };
                        availableForSale: boolean;
                        handle: string;
                    };
                    cursor: string;
                }[];
            };
        };
    };
};
export declare const shopifyProductsByKeyword: {
    data: {
        products: {
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
            edges: {
                node: {
                    id: string;
                    title: string;
                    description: string;
                    collections: {
                        edges: any[];
                        pageInfo: {
                            hasNextPage: boolean;
                            endCursor: any;
                        };
                    };
                    tags: string[];
                    variants: {
                        edges: {
                            node: {
                                id: string;
                                title: string;
                                sku: string;
                                selectedOptions: {
                                    name: string;
                                    value: string;
                                }[];
                                price: {
                                    currencyCode: string;
                                    amount: string;
                                };
                                unitPrice: any;
                                compareAtPrice: any;
                                image: {
                                    id: string;
                                    url: string;
                                    altText: string;
                                };
                            };
                            cursor: string;
                        }[];
                        pageInfo: {
                            hasNextPage: boolean;
                            endCursor: string;
                        };
                    };
                    images: {
                        edges: {
                            node: {
                                id: string;
                                url: string;
                                altText: string;
                            };
                            cursor: string;
                        }[];
                        pageInfo: {
                            hasNextPage: boolean;
                            endCursor: string;
                        };
                    };
                    availableForSale: boolean;
                    handle: string;
                };
                cursor: string;
            }[];
        };
    };
};
export declare const shopifySegments: {
    data: {
        segments: {
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
            edges: {
                node: {
                    id: string;
                    name: string;
                    cursor: string;
                };
            }[];
        };
    };
    extensions: {
        cost: {
            requestedQueryCost: number;
            actualQueryCost: number;
            throttleStatus: {
                maximumAvailable: number;
                currentlyAvailable: number;
                restoreRate: number;
            };
        };
    };
};
