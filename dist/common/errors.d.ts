export declare class IntegrationError extends Error {
    errorUrl: string;
}
export declare class CodecNotFoundError extends IntegrationError {
    constructor(message: string);
}
