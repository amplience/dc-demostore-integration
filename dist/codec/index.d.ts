import { Dictionary } from 'lodash';
import { API, CommerceAPI } from '..';
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, Identifiable, Product } from '../common/types';
import { Exception } from '../common/api';
export declare enum CodecTypes {
    commerce = 0
}
export declare type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty;
export declare class CodecType {
    _type: CodecTypes;
    _properties: Dictionary<AnyProperty>;
    _vendor: string;
    get type(): CodecTypes;
    get vendor(): string;
    get properties(): Dictionary<AnyProperty>;
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<API>;
}
export declare class CommerceCodecType extends CodecType {
    get type(): CodecTypes;
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<CommerceAPI>;
}
export declare class CommerceCodec implements CommerceAPI {
    config: CodecPropertyConfig<Dictionary<AnyProperty>>;
    megaMenu: Category[];
    constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>);
    init(): Promise<CommerceCodec>;
    findCategory(slug: string): Category;
    cacheMegaMenu(): Promise<void>;
    getProduct(args: GetCommerceObjectArgs): Promise<Product>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCategory(args: GetCommerceObjectArgs): Promise<Category>;
    getMegaMenu(args: CommonArgs): Promise<Category[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[] | Exception>;
}
export declare type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string : T[K] extends StringConstProperty ? string : T[K] extends NumberProperty ? number : T[K] extends IntegerProperty ? number : any[];
};
export declare const getCodecs: (type: CodecTypes) => CodecType[];
export declare const registerCodec: (codec: CodecType) => void;
import { StringProperty, NumberProperty, IntegerProperty, ArrayProperty, StringConstProperty } from './cms-property-types';
export declare const getCodec: (config: any, type: CodecTypes) => Promise<API>;
export declare const defaultArgs: CommonArgs;
export declare const getCommerceCodec: (config: any) => Promise<CommerceAPI>;
export * from './codecs/common';
