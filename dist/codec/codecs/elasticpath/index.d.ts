import { Category, ClientCredentialsConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, OAuthRestClientInterface, Product } from "../../../common";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from "../..";
import { StringProperty } from "../../cms-property-types";
import Moltin, { Moltin as MoltinApi, PriceBookPriceBase } from '@moltin/sdk';
declare type CodecConfig = ClientCredentialsConfiguration & {
    pcm_url: StringProperty;
    catalog_name: StringProperty;
};
export declare class ElasticPathCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class ElasticPathCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: OAuthRestClientInterface;
    moltin: MoltinApi;
    catalog: Moltin.Catalog;
    pricebooks: Moltin.PriceBook[];
    init(): Promise<CommerceCodec>;
    fetch(url: string): Promise<any>;
    getHierarchyRootNode(category: Category): Category;
    getFileById(id: string): Promise<Moltin.File>;
    mapProduct(product: any): Promise<Product>;
    getPriceForSkuInPricebook(sku: string, pricebookId: string): Promise<PriceBookPriceBase>;
    getPriceForSku(sku: string): Promise<{
        amount: number;
    }>;
    getProductsForHierarchy(hierarchyId: string): Promise<Moltin.Product[]>;
    getProductsForNode(nodeId: string): Promise<Moltin.Product[]>;
    getHierarchy(hierarchyId: string): Promise<Category>;
    getNode(hierarchyId: string, nodeId: string): Promise<Category>;
    cacheMegaMenu(): Promise<void>;
    getProductById(productId: string): Promise<Moltin.Product>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default ElasticPathCommerceCodecType;
