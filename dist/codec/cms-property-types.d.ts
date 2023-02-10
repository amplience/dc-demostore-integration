/**
 * Common JSON schema fields.
 */
export declare type Property = {
    title: string;
};
/**
 * JSON schema fields for a string property.
 */
export declare type StringProperty = Property & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};
/**
 * JSON schema fields for a const string property.
 */
export declare type StringConstProperty = StringProperty & {
    const: string;
};
/**
 * JSON schema fields for a numeric property.
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
 * JSON schema fields for an integer property.
 */
export declare type IntegerProperty = NumberProperty & {
    type: 'integer';
};
/**
 * JSON schema fields for an array property.
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
 * Common string validation patterns.
 */
export declare const StringPatterns: {
    anyUrl: string;
    httpUrl: string;
};
