import { Dictionary } from 'lodash';
import { API, CommerceAPI } from '../../common';
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, Identifiable, Product } from '../../common/types';
/**
 * Types of codec.
 */
export declare enum CodecTypes {
    commerce = 0
}
/**
 * Any JSON schema property object.
 */
export declare type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty;
/**
 * Codec base class. Defines methods and fields a codec must have.
 */
export declare class CodecType {
    _type: CodecTypes;
    _properties: Dictionary<AnyProperty>;
    _vendor: string;
    /**
     * The type of this codec.
     */
    get type(): CodecTypes;
    /**
     * The vendor associated with this codec.
     */
    get vendor(): string;
    /**
     * The schema URI for this codec.
     */
    get schemaUri(): string;
    /**
     * The label for this codec.
     */
    get label(): string;
    /**
     * The Icon URL that represents this codec.
     */
    get iconUrl(): string;
    /**
     * The JSON schema that represents the codec's configuration.
     */
    get schema(): any;
    /**
     * The properties that represent the codec configuration in JSON schema format.
     */
    get properties(): Dictionary<AnyProperty>;
    /**
     * Get an API for this codec with the given configuration.
     * @param config Configuration for the API.
     */
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<API>;
    /**
     * Process the config in a codec specific way.
     * @param config Input configuration.
     * @returns Processed configuration.
     */
    postProcess(config: any): Promise<any>;
}
/**
 * Commerce type codec base class. Defines methods and fields a commerce codec must have.
 */
export declare class CommerceCodecType extends CodecType {
    /**
     * The type of this codec. (commerce)
     */
    get type(): CodecTypes;
    /**
     * Get an API for this codec with the given configuration.
     * @param config Configuration for the API.
     */
    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<CommerceAPI>;
}
/**
 * Codec operations for testing.
 */
export declare enum CodecTestOperationType {
    categoryTree = 0,
    getCategory = 1,
    getProductById = 2,
    getProductsByKeyword = 3,
    getProductsByProductIds = 4,
    getCustomerGroups = 5
}
/**
 * Codec testing results.
 */
export interface CodecTestResult {
    operationType: CodecTestOperationType;
    description: string;
    arguments: string;
    duration: number;
    results: any;
}
/**
 * Base class for an implementation of a Commerce API.
 */
export declare class CommerceCodec implements CommerceAPI {
    config: CodecPropertyConfig<Dictionary<AnyProperty>>;
    categoryTree: Category[];
    codecType: CommerceCodecType;
    initDuration: number;
    categoryTreePromise?: Promise<void>;
    /**
     * Create a new Commerce API implementation, given an input configuration.
     * @param config API configuration
     */
    constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>);
    /**
     * Initilize the commerce codec.
     * @param codecType The codec type for this API.
     * @returns The commerce codec
     */
    init(codecType: CommerceCodecType): Promise<CommerceCodec>;
    /**
     * Find a category with a given slug.
     * @param slug Slug to locate a category for
     * @returns Category matching the slug
     */
    findCategory(slug: string): Category;
    /**
     * Cache the category tree.
     */
    cacheCategoryTree(): Promise<void>;
    /**
     * Ensures that the category tree has been fetched. If not, it is fetched immediately.
     * @returns A promise that resolves when the category tree is avaiable
     */
    ensureCategoryTree(): Promise<void>;
    /**
     * Get a single product by ID.
     * @param args Arguments object
     * @returns Single product
     */
    getProduct(args: GetCommerceObjectArgs): Promise<Product>;
    /**
     * Gets products by a list of IDs or a filter.
     * @param args Arguments object
     * @returns List of products
     */
    getProducts(args: GetProductsArgs): Promise<Product[]>;
    /**
     * Gets a category that matches the given slug, with contained products.
     * @param args Arguments object
     * @returns Category object
     */
    getCategory(args: GetCommerceObjectArgs): Promise<Category>;
    /**
     * Gets the category tree for the current configuration.
     * @param args Arguments object
     * @returns Category Tree
     */
    getCategoryTree(args: CommonArgs): Promise<Category[]>;
    /**
     * Gets customer groups for the current configuration.
     * @param args Arguments object
     * @returns List of customer groups
     */
    getCustomerGroups(args: CommonArgs): Promise<Identifiable[]>;
    /**
     * Gets products by a list of IDs or a filter, in their original format.
     * @param args Arguments object
     * @returns List of products in their original format
     */
    getRawProducts(args: GetProductsArgs): Promise<any[]>;
    /**
     * Test the various methods of this integration and provide a report.
     * @returns A report of all test results.
     */
    testIntegration(): Promise<CodecTestResult[]>;
}
/**
 * Get a random element from the given array
 * @param array Array of choices
 * @returns A random item from the array
 */
export declare const getRandom: <T>(array: T[]) => T;
/**
 * Top level JSON schema properties for a codec's configuration.
 */
export declare type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string : T[K] extends StringConstProperty ? string : T[K] extends NumberProperty ? number : T[K] extends IntegerProperty ? number : any[];
};
import { StringProperty, NumberProperty, IntegerProperty, ArrayProperty, StringConstProperty } from '../cms-property-types';
