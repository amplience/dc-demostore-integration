export interface SFCCCategory {
    categories?: SFCCCategory[];
    id: string;
    image: string;
    name: string;
    page_description?: string;
    page_title?: string;
    parent_category_id: string;
    c_enableCompare: boolean;
    c_headerMenuBanner?: string;
    c_headerMenuOrientation?: string;
    c_showInMenu: boolean;
    page_keywords?: string;
    c_slotBannerImage?: string;
    c_alternativeUrl?: string;
}
export interface SFCCCustomerGroup {
    _type: string;
    _resource_state: string;
    id: string;
    link: string;
}
