import { Category, CommerceAPI, CommonArgs, CustomerGroup, GetProductsArgs, Identifiable, Product } from '../../../common';
import { Dictionary } from 'lodash';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../../';
import { StringProperty } from '../../cms-property-types';
declare type CodecConfig = {
    productURL: StringProperty;
    categoryURL: StringProperty;
    customerGroupURL: StringProperty;
    translationsURL: StringProperty;
};
export declare class RestCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class RestCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    categories: Category[];
    products: Product[];
    customerGroups: CustomerGroup[];
    translations: Dictionary<Dictionary<string>>;
    cacheMegaMenu(): Promise<void>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default RestCommerceCodecType;
