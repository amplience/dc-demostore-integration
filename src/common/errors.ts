export class IntegrationError {
    message: string
    helpUrl: string

    constructor({ message, helpUrl }) {
        this.message = message
        this.helpUrl = helpUrl
    }

    getMessage(): string {
        return `[ demostore ] ${this.message}\nsee: ${this.helpUrl}`
    }
}