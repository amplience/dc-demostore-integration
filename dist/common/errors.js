"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodecNotFoundError = exports.IntegrationError = void 0;
class IntegrationError extends Error {
}
exports.IntegrationError = IntegrationError;
class CodecNotFoundError extends IntegrationError {
    constructor(message) {
        super(`[ demostore ] ${message}`);
        this.errorUrl = 'https://github.com/amplience/dc-demostore-core/blob/main/docs/FAQ.md#error---error--demostore--no-codecs-found-matching-schema';
    }
}
exports.CodecNotFoundError = CodecNotFoundError;
