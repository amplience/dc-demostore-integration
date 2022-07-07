"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationError = void 0;
class IntegrationError {
    constructor({ message, helpUrl }) {
        this.message = message;
        this.helpUrl = helpUrl;
    }
    getMessage() {
        return `[ demostore ] ${this.message}\nsee: ${this.helpUrl}`;
    }
}
exports.IntegrationError = IntegrationError;
