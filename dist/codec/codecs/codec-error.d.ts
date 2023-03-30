/**
 * Codec error types.
 */
export declare enum CodecErrorType {
    IncorrectArguments = 0,
    AuthUnreachable = 1,
    AuthError = 2,
    ApiUnreachable = 3,
    ApiError = 4,
    ApiGraphQL = 5,
    NotAuthenticated = 6,
    NotFound = 7,
    NotSupported = 8
}
/**
 * Codec error info for an HTTP error.
 */
export interface CodecApiErrorInfo {
    status: number;
    message: string;
}
/**
* Codec error info for a GraphQL error.
*/
export interface CodecGqlErrorInfo {
    message: string;
    errors: {
        message: string;
    }[];
}
/**
 * Codec error info for a generic error.
 */
export interface CodecGenericErrorInfo {
    message: string;
}
/**
 * Catch axios errors on a given method and convert them into a sanitized CodecError.
 * @param method Method to catch any axios errors for
 * @param errorType Default error type for unhandled errors
 * @returns Result of the method
 */
export declare function catchAxiosErrors<T>(method: () => Promise<T>, errorType?: CodecErrorType): Promise<T>;
/**
 * Types of information that can be included in a CodecError.
 */
export declare type CodecErrorInfo = CodecApiErrorInfo | CodecGenericErrorInfo | CodecGqlErrorInfo | undefined;
/**
 * A generic error that can be thrown by a codec, with an error type and optional information.
 */
export declare class CodecError extends Error {
    type: CodecErrorType;
    info?: CodecErrorInfo;
    errorType: 'codec';
    constructor(type: CodecErrorType, info?: CodecErrorInfo);
}
