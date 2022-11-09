import { APIConfiguration, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from '../../../common';
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../..';
import { StringProperty } from '../../cms-property-types';
import { HybrisProduct } from './types';
import { AxiosInstance } from 'axios';
declare type CodecConfig = APIConfiguration & {
    catalog_id: StringProperty;
};
export declare class HybrisCommerceCodecType extends CommerceCodecType {
    get vendor(): string;
    get properties(): CodecConfig;
    getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI>;
}
export declare class HybrisCommerceCodec extends CommerceCodec {
    config: CodecPropertyConfig<CodecConfig>;
    rest: AxiosInstance;
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    fetch(url: string): Promise<any>;
    cacheMegaMenu(): Promise<void>;
    getProductById(id: string): Promise<HybrisProduct>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
}
export default HybrisCommerceCodecType;
