import { Product } from "../../../types";
import Moltin, { Hierarchy } from "@moltin/sdk";
import { AttributedProduct, ElasticPathCategory } from ".";
declare const mappers: (api: any) => {
    mapHierarchy: (hierarchy: Hierarchy) => Promise<ElasticPathCategory>;
    mapNode: (hierarchy: Hierarchy) => (node: Moltin.Node) => Promise<ElasticPathCategory>;
    mapProduct: (skeletonProduct: AttributedProduct) => Promise<Product>;
};
export default mappers;
