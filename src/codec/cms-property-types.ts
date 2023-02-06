/**
 * TODO
 */
export type Property = {
    title: string;
};

/**
 * TODO
 */
export type StringProperty = Property & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};

/**
 * TODO
 */
export type StringConstProperty = StringProperty & {
    const: string;
};

/**
 * TODO
 */
export type NumberProperty = Property & {
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
export type IntegerProperty = NumberProperty & {
    type: 'integer';
};

/**
 * TODO
 */
export type ArrayProperty = Property & {
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
export const StringPatterns = {
    anyUrl: ".+://.+",
    httpUrl: "https?://.+"
}