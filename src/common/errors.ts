/**
 * Error type thrown by integrations.
 */
export class IntegrationError {
	errorType: 'integration' = 'integration'
	message: string
	helpUrl: string

	/**
	 * Create a new IntegrationError.
	 * @param param0.message Error message
	 * @param param0.helpUrl URL for any helpful documentation
	 */
	constructor({ message, helpUrl }) {
		this.message = message
		this.helpUrl = helpUrl
	}
	
	/**
	 * Get a formatted message combining both the message property and the help URL.
	 * @returns A formatted message
	 */
	getMessage(): string {
		return `[ demostore ] ${this.message}\nsee: ${this.helpUrl}`
	}
}