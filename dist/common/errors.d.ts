export declare class IntegrationError {
    message: string;
    helpUrl: string;
    constructor({ message, helpUrl }: {
        message: any;
        helpUrl: any;
    });
    getMessage(): string;
}
