export interface EPCustomerGroup {
    id: string;
    type: string;
    "group-name": string;
    meta: Meta;
    links: Links;
    relationships: Relationships;
}
export interface Links {
    self: string;
}
export interface Meta {
    timestamps: Timestamps;
}
export interface Timestamps {
    created_at: string;
    updated_at: string;
}
export interface Relationships {
    "assigned-customers": AssignedCustomers;
}
export interface AssignedCustomers {
    data: null;
}
