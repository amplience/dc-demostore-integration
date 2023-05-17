export interface Child {
    id: string;
    nodeId: number;
    name: string;
    attributes: any[];
    breadcrumbs: Breadcrumb[];
    children: FabricCategory[];
}
export interface FabricCategory {
    id: string;
    nodeId: number;
    name: string;
    isActive?: boolean;
    hierarchy?: string;
    attributes: any[];
    breadcrumbs: Breadcrumb[];
    children: Child[];
}
export interface Breadcrumb {
    id: string;
    nodeId: number;
    name: string;
    hierarchy?: string;
    isActive?: boolean;
    level: number;
}
export interface FabricProduct {
    _id: string;
    sku: string;
    itemId: number;
    children: any[];
    type: string;
    bundleItems: any[];
    categories: FabricCategory[];
    attributes: Attribute[];
    variants: any[];
    dependents: any[];
    createdOn: string;
    modifiedOn: string;
}
export interface Attribute {
    id: string;
    name: string;
    description: string;
    mapping: string;
    type: string;
    value: string;
}