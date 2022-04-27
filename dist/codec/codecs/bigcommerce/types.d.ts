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
export interface BigCommerceRetail {
    id: number;
    calculated_price: number;
    sale_price: number;
    price: number;
    cost_price: number;
    retail_price: number;
    map_price: number;
    sku: string;
    weight: number;
    width: number;
    height: number;
    depth: number;
    fixed_cost_shipping_price: number;
    is_free_shipping: boolean;
    upc: string;
    mpn: string;
    gtin: string;
    inventory_level: number;
    inventory_warning_level: number;
    bin_picking_number: string;
}
export interface BigCommerceProduct extends BigCommerceRetail {
    name: string;
    type: string;
    description: string;
    tax_class_id: number;
    product_tax_code: string;
    categories: number[];
    brand_id: number;
    option_set_id: number;
    option_set_display: string;
    inventory_tracking: string;
    reviews_rating_sum: number;
    reviews_count: number;
    total_sold: number;
    is_visible: boolean;
    is_featured: boolean;
    related_products: number[];
    warranty: string;
    layout_file: string;
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
export interface BigCommerceVariant extends BigCommerceRetail {
    product_id: number;
    sku_id: number;
    calculated_weight: number;
    purchasing_disabled: boolean;
    purchasing_disabled_message: string;
    image_url: string;
    cost_price: number;
    option_values: OptionValue[];
}
export interface BigCommerceCustomerGroup {
    id: number;
    name: string;
    category_access: any;
    discount_rules: any[];
    is_group_for_guests: boolean;
    is_default: boolean;
}
export interface OptionValue {
    id: number;
    label: string;
    option_id: number;
    option_display_name: string;
}
