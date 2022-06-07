import { Dictionary } from 'lodash';
import { API, CommerceAPI } from '..';
export declare type CodecConfiguration = {
    _meta?: {
        deliveryKey?: string;
        deliveryId: string;
        schema: string;
    };
    locator?: string;
};
export declare type Property = {
    title: string;
};
export declare type StringProperty = Property & {
    type: 'string';
    minLength?: number;
    maxLength?: number;
    pattern?: string;
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
export declare type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty;
export interface Codec {
    schema: {
        uri: string;
        properties: Dictionary<AnyProperty>;
        icon: string;
    };
    getAPI(config: any): any;
}
export interface CommerceCodec extends Codec {
    getAPI(config: any): CommerceAPI;
}
export declare type CodecStringConfig<T> = {
    [Key in keyof T]: string;
};
export declare const getCodecs: () => Codec[];
export declare const registerCodec: (codec: Codec) => void;
export declare const getCodec: (config: any) => Promise<API>;
