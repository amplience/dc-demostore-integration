import { CodecConfiguration } from "../../../codec";
import { Category } from "../../../types";
export interface BigCommerceCategory {
    id: number;
    parent_id: number;
    name: string;
    description: string;
    views: number;
    sort_order: number;
    page_title: string;
    meta_keywords: string[];
    meta_description: string;
    layout_file: string;
    image_url: string;
    is_visible: boolean;
    search_keywords: string;
    default_product_sort: string;
    custom_url: CustomURL;
    children: BigCommerceCategory[];
}
export interface CustomURL {
    url: string;
    is_customized: boolean;
}
export interface BigCommerceProduct {
    id: number;
    name: string;
    type: string;
    sku: string;
    description: string;
    weight: number;
    width: number;
    depth: number;
    height: number;
    price: number;
    cost_price: number;
    retail_price: number;
    sale_price: number;
    map_price: number;
    tax_class_id: number;
    product_tax_code: string;
    calculated_price: number;
    categories: number[];
    brand_id: number;
    option_set_id: number;
    option_set_display: string;
    inventory_level: number;
    inventory_warning_level: number;
    inventory_tracking: string;
    reviews_rating_sum: number;
    reviews_count: number;
    total_sold: number;
    fixed_cost_shipping_price: number;
    is_free_shipping: boolean;
    is_visible: boolean;
    is_featured: boolean;
    related_products: number[];
    warranty: string;
    bin_picking_number: string;
    layout_file: string;
    upc: string;
    mpn: string;
    gtin: string;
    search_keywords: string;
    availability: string;
    availability_description: string;
    gift_wrapping_options_type: string;
    gift_wrapping_options_list: any[];
    sort_order: number;
    condition: string;
    is_condition_shown: boolean;
    order_quantity_minimum: number;
    order_quantity_maximum: number;
    page_title: string;
    meta_keywords: any[];
    meta_description: string;
    date_created: string;
    date_modified: string;
    view_count: number;
    preorder_release_date: null;
    preorder_message: string;
    is_preorder_only: boolean;
    is_price_hidden: boolean;
    price_hidden_label: string;
    custom_url: CustomURL;
    base_variant_id: null;
    open_graph_type: string;
    open_graph_title: string;
    open_graph_description: string;
    open_graph_use_meta_description: boolean;
    open_graph_use_product_name: boolean;
    open_graph_use_image: boolean;
    variants: BigCommerceVariant[];
    images: any[];
}
export interface CustomURL {
    url: string;
    is_customized: boolean;
}
export interface BigCommerceVariant {
    id: number;
    product_id: number;
    sku: string;
    sku_id: number;
    price: null;
    calculated_price: number;
    sale_price: null;
    retail_price: null;
    map_price: null;
    weight: null;
    calculated_weight: number;
    width: null;
    height: null;
    depth: null;
    is_free_shipping: boolean;
    fixed_cost_shipping_price: null;
    purchasing_disabled: boolean;
    purchasing_disabled_message: string;
    image_url: string;
    cost_price: number;
    upc: string;
    mpn: string;
    gtin: string;
    inventory_level: number;
    inventory_warning_level: number;
    bin_picking_number: string;
    option_values: OptionValue[];
}
export interface OptionValue {
    id: number;
    label: string;
    option_id: number;
    option_display_name: string;
}
export interface BigCommerceCodecConfiguration extends CodecConfiguration {
    api_url: string;
    api_token: string;
    store_hash: string;
}
export interface BigCommerceAPI {
    getCategoryTree: () => Promise<BigCommerceCategory[]>;
    getProducts: () => Promise<BigCommerceProduct[]>;
    searchProducts: (keyword: string) => Promise<BigCommerceProduct[]>;
    getProductById: (id: string) => Promise<BigCommerceProduct>;
    getProductsForCategory: (cat: Category) => Promise<BigCommerceProduct[]>;
}
