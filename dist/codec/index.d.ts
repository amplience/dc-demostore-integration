import { Dictionary } from 'lodash';
import { API, CommerceAPI } from '..';
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
export declare enum CodecType {
    commerce = 0
}
export declare type Codec<T> = {
    schema: {
        type: CodecType;
        uri: string;
        properties: Dictionary<AnyProperty>;
        icon: string;
    };
    getAPI(config: any): Promise<T>;
};
export declare type GenericCodec = Codec<API>;
export declare type CommerceCodec = Codec<CommerceAPI>;
export declare type CodecStringConfig<T> = {
    [Key in keyof T]: string;
};
export declare const getCodecs: (type: CodecType) => Codec<any>[];
export declare const registerCodec: (codec: Codec<any>) => void;
export declare const getCodec: (config: any, type: CodecType) => Promise<API>;
export declare const getCommerceCodec: (config: any) => Promise<CommerceAPI>;
