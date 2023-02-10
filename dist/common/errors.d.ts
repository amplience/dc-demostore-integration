/**
 * Error type thrown by integrations.
 */
export declare class IntegrationError {
    message: string;
    helpUrl: string;
    /**
     * Create a new IntegrationError.
     * @param param0.message Error message
     * @param param0.helpUrl URL for any helpful documentation
     */
    constructor({ message, helpUrl }: {
        message: any;
        helpUrl: any;
    });
    /**
     * Get a formatted message combining both the message property and the help URL.
     * @returns A formatted message
     */
    getMessage(): string;
}
