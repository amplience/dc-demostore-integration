import { Dictionary } from 'lodash';
import { API, CommerceAPI } from '..';
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, GetVariantsArgs, Identifiable, Product } from '../common/types';
/**
 * TODO
 */
export declare enum CodecTypes {
    commerce = 0
}
/**
 * TODO
 */
export declare type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty;
/**
 * TODO
 */
export declare class CodecType {
    _type: CodecTypes;
    _properties: Dictionary<AnyProperty>;
    _vendor: string;
    /**
     * TODO
     */
    get type(): CodecTypes;
    /**
     * TODO
     */
    get vendor(): string;
    /**
     * TODO
     */
    get schemaUri(): string;
    /**
     * TODO
     */
    get label(): string;
    /**
     * TODO
     */
    get iconUrl(): string;
    /**
     * TODO
     */
    get schema(): any;
    /**
     * TODO
     */
    get properties(): Dictionary<AnyProperty>;
    /**
     * TODO
     * @param config
     */
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<API>;
    /**
     * TODO
     * @param config
     * @returns
     */
    postProcess(config: any): Promise<any>;
}
/**
 * TODO
 */
export declare class CommerceCodecType extends CodecType {
    /**
     * TODO
     */
    get type(): CodecTypes;
    /**
     * TODO
     * @param config
     */
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<CommerceAPI>;
}
/**
 * TODO
 */
export declare enum CodecTestOperationType {
    megaMenu = 0,
    getCategory = 1,
    getProductById = 2,
    getProductsByKeyword = 3,
    getProductsByProductIds = 4,
    getCustomerGroups = 5
}
/**
 * TODO
 */
export interface CodecTestResult {
    operationType: CodecTestOperationType;
    description: string;
    arguments: string;
    duration: number;
    results: any;
}
/**
 * TODO
 */
export declare class CommerceCodec implements CommerceAPI {
    config: CodecPropertyConfig<Dictionary<AnyProperty>>;
    megaMenu: Category[];
    codecType: CommerceCodecType;
    initDuration: number;
    /**
     * TODO
     * @param config
     */
    constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>);
    /**
     * TODO
     * @param codecType
     * @returns
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * TODO
     * @param slug
     * @returns
     */
    findCategory(slug: string): Category;
    /**
     * TODO
     */
    cacheMegaMenu(): Promise<void>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getProduct(args: GetCommerceObjectArgs): Promise<Product>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getCategory(args: GetCommerceObjectArgs): Promise<Category>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getMegaMenu(args: CommonArgs): Promise<Category[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getVariants(args: GetVariantsArgs): Promise<SFCCProduct>;
    /**
     * TODO
     * @param args
     * @returns
     */
    getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]>;
    /**
     * TODO
     * @returns
     */
    testIntegration(): Promise<CodecTestResult[]>;
}
/**
 * TODO
 * @param array
 * @returns
 */
export declare const getRandom: <T>(array: T[]) => T;
/**
 * TODO
 */
export declare type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string : T[K] extends StringConstProperty ? string : T[K] extends NumberProperty ? number : T[K] extends IntegerProperty ? number : any[];
};
/**
 * TODO
 * @param type
 * @returns
 */
export declare const getCodecs: (type?: CodecTypes) => CodecType[];
/**
 * TODO
 * @param codec
 */
export declare const registerCodec: (codec: CodecType) => void;
import { StringProperty, NumberProperty, IntegerProperty, ArrayProperty, StringConstProperty } from './cms-property-types';
/**
 * TODO
 * @param config
 * @param type
 * @returns
 */
export declare const getCodec: (config: any, type: CodecTypes) => Promise<API>;
export declare const defaultArgs: CommonArgs;
/**
 * TODO
 * @param config
 * @returns
 */
export declare const getCommerceCodec: (config: any) => Promise<CommerceAPI>;
import { SFCCProduct } from './codecs/sfcc/types';
export * from './codecs/common';
