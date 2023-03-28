/**
 * Common JSON schema fields.
 */
export type Property = {
	title: string;
};

/**
 * JSON schema fields for a string property.
 */
export type StringProperty = Property & {
	type: 'string';
	minLength?: number;
	maxLength?: number;
	pattern?: string;
};

/**
 * JSON schema fields for a const string property.
 */
export type StringConstProperty = StringProperty & {
	const: string;
};

/**
 * JSON schema fields for a numeric property.
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
 * JSON schema fields for an integer property.
 */
export type IntegerProperty = NumberProperty & {
	type: 'integer';
};

/**
 * JSON schema fields for an array property.
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
 * Common string validation patterns.
 */
export const StringPatterns = {
	anyUrl: '.+://.+',
	httpUrl: 'https?://.+'
}