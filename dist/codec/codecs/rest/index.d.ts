import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, Product } from '../../../common';
import { Dictionary } from 'lodash';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../';
import { StringProperty } from '../../cms-property-types';
/**
 * TODO
 */
declare type CodecConfig = {
    productURL: StringProperty;
    categoryURL: StringProperty;
    customerGroupURL: StringProperty;
    translationsURL: StringProperty;
};
export declare class RestCommerceCodecType extends CommerceCodecType {
    /**
     * TODO
     */
    get vendor(): string;
    /**
     * TODO
     */
    get properties(): CodecConfig;
    /**
     * TODO
     * @param config
     * @returns
     */
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
/**
 * TODO
 */
export declare class RestCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    categories: Category[];
    products: Product[];
    customerGroups: CustomerGroup[];
    translations: Dictionary<Dictionary<string>>;
    /**
     * TODO
     */
    cacheMegaMenu(): Promise<void>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default RestCommerceCodecType;
