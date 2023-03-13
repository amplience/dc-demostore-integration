export declare const ctoolsProduct: (id: string) => {
    id: string;
    version: number;
    productType: {
        typeId: string;
        id: string;
    };
    name: {
        en: string;
        es: string;
        fr: string;
    };
    description: {
        en: string;
    };
    categories: {
        typeId: string;
        id: string;
    }[];
    categoryOrderHints: {};
    slug: {
        en: string;
    };
    metaTitle: {
        fr: string;
        it: string;
        en: string;
        de: string;
        es: string;
    };
    metaDescription: {
        fr: string;
        it: string;
        en: string;
        de: string;
        es: string;
    };
    variants: any[];
    masterVariant: {
        attributes: {
            name: string;
            value: string;
        }[];
        assets: any[];
        images: {
            url: string;
            dimensions: {
                w: number;
                h: number;
            };
        }[];
        prices: {
            id: string;
            value: {
                type: string;
                currencyCode: string;
                centAmount: number;
                fractionDigits: number;
            };
            discounted: {
                value: {
                    type: string;
                    currencyCode: string;
                    centAmount: number;
                    fractionDigits: number;
                };
                discount: {
                    typeId: string;
                    id: string;
                };
            };
        }[];
        key: string;
        sku: string;
        id: number;
    };
    searchKeywords: {};
    hasStagedChanges: boolean;
    published: boolean;
    key: string;
    taxCategory: {
        typeId: string;
        id: string;
    };
    createdAt: string;
    lastModifiedAt: string;
};
export declare const ctoolsSearchResult: (total: number, pageSize: number, pageNumber: number, ids?: string[]) => {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: {
        id: string;
        version: number;
        productType: {
            typeId: string;
            id: string;
        };
        name: {
            en: string;
            es: string;
            fr: string;
        };
        description: {
            en: string;
        };
        categories: {
            typeId: string;
            id: string;
        }[];
        categoryOrderHints: {};
        slug: {
            en: string;
        };
        metaTitle: {
            fr: string;
            it: string;
            en: string;
            de: string;
            es: string;
        };
        metaDescription: {
            fr: string;
            it: string;
            en: string;
            de: string;
            es: string;
        };
        variants: any[];
        masterVariant: {
            attributes: {
                name: string;
                value: string;
            }[];
            assets: any[];
            images: {
                url: string;
                dimensions: {
                    w: number;
                    h: number;
                };
            }[];
            prices: {
                id: string;
                value: {
                    type: string;
                    currencyCode: string;
                    centAmount: number;
                    fractionDigits: number;
                };
                discounted: {
                    value: {
                        type: string;
                        currencyCode: string;
                        centAmount: number;
                        fractionDigits: number;
                    };
                    discount: {
                        typeId: string;
                        id: string;
                    };
                };
            }[];
            key: string;
            sku: string;
            id: number;
        };
        searchKeywords: {};
        hasStagedChanges: boolean;
        published: boolean;
        key: string;
        taxCategory: {
            typeId: string;
            id: string;
        };
        createdAt: string;
        lastModifiedAt: string;
    }[];
    facets: {};
};
export declare const ctoolsCategories: {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: {
        id: string;
        version: number;
        lastMessageSequenceNumber: number;
        createdAt: string;
        lastModifiedAt: string;
        lastModifiedBy: {
            clientId: string;
            isPlatformClient: boolean;
        };
        createdBy: {
            clientId: string;
            isPlatformClient: boolean;
        };
        key: string;
        name: {
            fr: string;
            it: string;
            en: string;
            de: string;
            es: string;
        };
        slug: {
            en: string;
        };
        ancestors: any[];
        orderHint: string;
        externalId: string;
        assets: any[];
    }[];
};
export declare const ctoolsCustomerGroups: {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: {
        id: string;
        version: number;
        createdAt: string;
        lastModifiedAt: string;
        lastModifiedBy: {
            clientId: string;
            isPlatformClient: boolean;
        };
        createdBy: {
            clientId: string;
            isPlatformClient: boolean;
        };
        name: string;
        key: string;
    }[];
};
