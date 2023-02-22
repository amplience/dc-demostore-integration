import { MockRequests } from '../../../../common/test/rest-mock';
export declare const sfccSearchHit: (id: string, categorySlug: string) => {
    _type: string;
    hit_type: string;
    link: string;
    product_id: string;
    product_name: string;
    product_type: {
        _type: string;
        master: boolean;
    };
    represented_product: {
        _type: string;
        id: string;
        link: string;
    };
};
export declare const sfccProduct: (id: string) => {
    _v: string;
    _type: string;
    currency: string;
    id: string;
    image_groups: ({
        _type: string;
        images: {
            _type: string;
            alt: string;
            dis_base_link: string;
            link: string;
            title: string;
        }[];
        view_type: string;
        variation_attributes?: undefined;
    } | {
        _type: string;
        images: {
            _type: string;
            alt: string;
            dis_base_link: string;
            link: string;
            title: string;
        }[];
        variation_attributes: {
            _type: string;
            id: string;
            values: {
                _type: string;
                value: string;
            }[];
        }[];
        view_type: string;
    })[];
    long_description: string;
    master: {
        _type: string;
        link: string;
        master_id: string;
        price: number;
    };
    min_order_quantity: number;
    name: string;
    page_description: string;
    page_title: string;
    price: number;
    price_per_unit: number;
    primary_category_id: string;
    short_description: string;
    step_quantity: number;
    type: {
        _type: string;
        master: boolean;
    };
    valid_from: {
        default: string;
    };
    variants: {
        _type: string;
        link: string;
        price: number;
        product_id: string;
        variation_values: {
            color: string;
            size: string;
        };
    }[];
    variation_attributes: {
        _type: string;
        id: string;
        name: string;
        values: {
            _type: string;
            name: string;
            orderable: boolean;
            value: string;
        }[];
    }[];
};
export declare const sfccProducts: (prefix: string, total: number) => MockRequests;
export declare const sfccSearchResult: (total: number, pageSize: number, pageNumber: number, categorySlug: string) => {
    _v: string;
    _type: string;
    count: number;
    hits: {
        _type: string;
        hit_type: string;
        link: string;
        product_id: string;
        product_name: string;
        product_type: {
            _type: string;
            master: boolean;
        };
        represented_product: {
            _type: string;
            id: string;
            link: string;
        };
    }[];
    refinements: ({
        _type: string;
        attribute_id: string;
        label: string;
        values: ({
            _type: string;
            hit_count: number;
            label: string;
            value: string;
            values: {
                _type: string;
                hit_count: number;
                label: string;
                value: string;
            }[];
        } | {
            _type: string;
            hit_count: number;
            label: string;
            value: string;
            values?: undefined;
        })[];
    } | {
        _type: string;
        attribute_id: string;
        label: string;
        values: {
            _type: string;
            hit_count: number;
            label: string;
            presentation_id: string;
            value: string;
        }[];
    } | {
        _type: string;
        attribute_id: string;
        label: string;
        values?: undefined;
    })[];
    search_phrase_suggestions: {
        _type: string;
    };
    selected_refinements: {
        cgid: string;
    };
    sorting_options: {
        _type: string;
        id: string;
        label: string;
    }[];
    start: number;
    total: number;
};
export declare const sfccCategories: {
    _v: string;
    _type: string;
    categories: ({
        _type: string;
        id: string;
        name: string;
        parent_category_id: string;
        parent_category_tree: {
            _type: string;
            id: string;
            name: string;
        }[];
        c_alternativeUrl: string;
        c_enableCompare: boolean;
        c_showInMenu: boolean;
        categories?: undefined;
        page_description?: undefined;
        page_title?: undefined;
        c_headerMenuBanner?: undefined;
        c_headerMenuOrientation?: undefined;
    } | {
        _type: string;
        categories: {
            _type: string;
            id: string;
            image: string;
            name: string;
            page_description: string;
            page_title: string;
            parent_category_id: string;
            parent_category_tree: {
                _type: string;
                id: string;
                name: string;
            }[];
            c_enableCompare: boolean;
            c_showInMenu: boolean;
            c_slotBannerImage: string;
        }[];
        id: string;
        name: string;
        page_description: string;
        page_title: string;
        parent_category_id: string;
        parent_category_tree: {
            _type: string;
            id: string;
            name: string;
        }[];
        c_enableCompare: boolean;
        c_headerMenuBanner: string;
        c_headerMenuOrientation: string;
        c_showInMenu: boolean;
        c_alternativeUrl?: undefined;
    })[];
    id: string;
    name: string;
};
export declare const sfccCustomerGroups: {
    _v: string;
    _type: string;
    count: number;
    data: {
        _type: string;
        _resource_state: string;
        id: string;
        link: string;
    }[];
    start: number;
    total: number;
};
