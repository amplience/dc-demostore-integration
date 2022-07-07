
export type Property = {
    title: string;
};

export type StringProperty = Property & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
};

export type StringConstProperty = StringProperty & {
    const: string;
};

export type NumberProperty = Property & {
    type: 'number';
    multipleOf?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
};

export type IntegerProperty = NumberProperty & {
    type: 'integer';
};

export type ArrayProperty = Property & {
    type: 'array';
    items?: number;
    minItems?: number;
    maxItems?: number;
    required?: boolean;
    uniqueItems?: boolean;
};
