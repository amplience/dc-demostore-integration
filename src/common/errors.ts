export class IntegrationError extends Error {
    errorUrl: string
}

export class CodecNotFoundError extends IntegrationError {
    constructor(message: string) {
        super(`[ demostore ] ${message}`)
        this.errorUrl = `https://github.com/amplience/dc-demostore-core/blob/main/docs/FAQ.md#error---error--demostore--no-codecs-found-matching-schema`
    }
}