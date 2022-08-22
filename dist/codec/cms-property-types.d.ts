export declare type Property = {
    title: string;
};
export declare type StringProperty = Property & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};
export declare type StringConstProperty = StringProperty & {
    const: string;
};
export declare type NumberProperty = Property & {
    type: 'number';
    multipleOf?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
};
export declare type IntegerProperty = NumberProperty & {
    type: 'integer';
};
export declare type ArrayProperty = Property & {
    type: 'array';
    items?: number;
    minItems?: number;
    maxItems?: number;
    required?: boolean;
    uniqueItems?: boolean;
};
export declare const StringPatterns: {
    anyUrl: string;
    httpUrl: string;
};
