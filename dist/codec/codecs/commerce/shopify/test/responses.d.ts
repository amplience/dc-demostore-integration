export declare const shopifyProduct: {};
export declare const shopifyCategories: {};
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
