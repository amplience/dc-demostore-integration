"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationError = void 0;
/**
 * TODO
 */
class IntegrationError {
    /**
     * TODO
     * @param param0
     */
    constructor({ message, helpUrl }) {
        this.message = message;
        this.helpUrl = helpUrl;
    }
    /**
     * TODO
     * @returns
     */
    getMessage() {
        return `[ demostore ] ${this.message}\nsee: ${this.helpUrl}`;
    }
}
exports.IntegrationError = IntegrationError;
