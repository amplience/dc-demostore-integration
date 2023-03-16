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
        };
    };
};
export declare const shopifyCategoryProducts: {
    data: {
        collection: {
            products: {
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
            edges: {
                node: {
                    id: string;
                    title: string;
                    description: string;
                    collections: {
                        edges: any[];
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
            edges: {
                node: {
                    id: string;
                    name: string;
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
