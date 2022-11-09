import { Dictionary } from 'lodash';
import { API, CommerceAPI } from '..';
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, GetVariantsArgs, Identifiable, Product } from '../common/types';
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
    get schemaUri(): string;
    get label(): string;
    get iconUrl(): string;
    get schema(): any;
    get properties(): Dictionary<AnyProperty>;
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<API>;
    postProcess(config: any): Promise<any>;
}
export declare class CommerceCodecType extends CodecType {
    get type(): CodecTypes;
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<CommerceAPI>;
}
export declare enum CodecTestOperationType {
    megaMenu = 0,
    getCategory = 1,
    getProductById = 2,
    getProductsByKeyword = 3,
    getProductsByProductIds = 4,
    getCustomerGroups = 5
}
export interface CodecTestResult {
    operationType: CodecTestOperationType;
    description: string;
    arguments: string;
    duration: number;
    results: any;
}
export declare class CommerceCodec implements CommerceAPI {
    config: CodecPropertyConfig<Dictionary<AnyProperty>>;
    megaMenu: Category[];
    codecType: CommerceCodecType;
    initDuration: number;
    constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>);
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    findCategory(slug: string): Category;
    cacheMegaMenu(): Promise<void>;
    getProduct(args: GetCommerceObjectArgs): Promise<Product>;
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    getCategory(args: GetCommerceObjectArgs): Promise<Category>;
    getMegaMenu(args: CommonArgs): Promise<Category[]>;
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
    getVariants(args: GetVariantsArgs): Promise<SFCCProduct>;
    testIntegration(): Promise<CodecTestResult[]>;
}
export declare const getRandom: <T>(array: T[]) => T;
export declare type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string : T[K] extends StringConstProperty ? string : T[K] extends NumberProperty ? number : T[K] extends IntegerProperty ? number : any[];
};
export declare const getCodecs: (type?: CodecTypes) => CodecType[];
export declare const registerCodec: (codec: CodecType) => void;
import { StringProperty, NumberProperty, IntegerProperty, ArrayProperty, StringConstProperty } from './cms-property-types';
export declare const getCodec: (config: any, type: CodecTypes) => Promise<API>;
export declare const defaultArgs: CommonArgs;
export declare const getCommerceCodec: (config: any) => Promise<CommerceAPI>;
import { SFCCProduct } from './codecs/sfcc/types';
export * from './codecs/common';
