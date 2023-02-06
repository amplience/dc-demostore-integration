/**
 * TODO
 */
export class IntegrationError {
	message: string
	helpUrl: string

	/**
	 * TODO
	 * @param param0 
	 */
	constructor({ message, helpUrl }) {
		this.message = message
		this.helpUrl = helpUrl
	}
	
	/**
	 * TODO
	 * @returns 
	 */
	getMessage(): string {
		return `[ demostore ] ${this.message}\nsee: ${this.helpUrl}`
	}
}