import { Product, CustomerGroup } from "../../../common/types";
import Moltin, { Hierarchy } from "@moltin/sdk";
import { AttributedProduct, ElasticPathCategory } from "./types";
import { EPCustomerGroup } from "./types";
declare const mappers: (api: any) => {
    mapHierarchy: (hierarchy: Hierarchy) => Promise<ElasticPathCategory>;
    mapNode: (hierarchy: Hierarchy) => (node: Moltin.Node) => Promise<ElasticPathCategory>;
    mapProduct: (skeletonProduct: AttributedProduct) => Promise<Product>;
    mapCustomerGroup: (customerGroup: EPCustomerGroup) => CustomerGroup;
};
export default mappers;
