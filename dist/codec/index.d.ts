import { CodecTypes, CodecType } from './codecs/core';
import { API, CommerceAPI } from '../common';
/**
 * Get all the codecs with a given type
 * @param type Codec type
 * @returns All registered codecs that match the type
 */
export declare const getCodecs: (type?: CodecTypes) => CodecType[];
/**
 * Register a codec type object.
 * @param codec Codec type object
 */
export declare const registerCodec: (codec: CodecType) => void;
/**
 * Get an API given a configuration object and a codec type.
 * It attempts to match a registered codec by the `vendor` property first, if present.
 * If not, it attempts to match based on the shape of the codec object.
 * @param config API configuration
 * @param type Type of codec to find
 * @returns A new API for the given configuration.
 */
export declare const getCodec: (config: any, type: CodecTypes) => Promise<API>;
/**
 * Get a commerce API given a configuration object.
 * It attempts to match a registered codec by the `vendor` property first, if present.
 * If not, it attempts to match based on the shape of the codec object.
 * @param config Configuration object for the commerce API
 * @returns A new commerce API for the given configuration
 */
export declare const getCommerceCodec: (config: any) => Promise<CommerceAPI>;
export * from './codecs/common';
export * from './codecs/core';
