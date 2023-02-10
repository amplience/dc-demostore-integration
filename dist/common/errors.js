"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationError = void 0;
/**
 * Error type thrown by integrations.
 */
class IntegrationError {
    /**
     * Create a new IntegrationError.
     * @param param0.message Error message
     * @param param0.helpUrl URL for any helpful documentation
     */
    constructor({ message, helpUrl }) {
        this.message = message;
        this.helpUrl = helpUrl;
    }
    /**
     * Get a formatted message combining both the message property and the help URL.
     * @returns A formatted message
     */
    getMessage() {
        return `[ demostore ] ${this.message}\nsee: ${this.helpUrl}`;
    }
}
exports.IntegrationError = IntegrationError;
