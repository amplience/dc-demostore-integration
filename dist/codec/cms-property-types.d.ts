/**
 * TODO
 */
export declare type Property = {
    title: string;
};
/**
 * TODO
 */
export declare type StringProperty = Property & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};
/**
 * TODO
 */
export declare type StringConstProperty = StringProperty & {
    const: string;
};
/**
 * TODO
 */
export declare type NumberProperty = Property & {
    type: 'number';
    multipleOf?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
};
/**
 * TODO
 */
export declare type IntegerProperty = NumberProperty & {
    type: 'integer';
};
/**
 * TODO
 */
export declare type ArrayProperty = Property & {
    type: 'array';
    items?: number;
    minItems?: number;
    maxItems?: number;
    required?: boolean;
    uniqueItems?: boolean;
};
/**
 * TODO
 */
export declare const StringPatterns: {
    anyUrl: string;
    httpUrl: string;
};
