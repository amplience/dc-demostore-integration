/**
 * Codec error types.
 */
export enum CodecErrorType {
	AuthUnreachable,
	AuthError,
	ApiUnreachable,
	ApiError,

	NotAuthenticated,
	NotFound,
	NotSupported
}

/**
 * Codec error info for an HTTP error.
 */
export interface CodecApiErrorInfo {
	status: number;
	message: string;
}

/**
 * Converts a codec error type to a descriptive string.
 * @param type The codec error type
 * @returns A descriptive string
 */
function typeToString(type: CodecErrorType) {
	let name = CodecErrorType[type]

	for (let i = 1; i < name.length; i++) {
		if (name[i].toLowerCase() !== name[i]) {
			name = name.substring(0, i) + ' ' + name.substring(i)
			i++
		}
	}

	return name + '.'
}

/**
 * Catch axios errors on a given method and convert them into a sanitized CodecError.
 * @param method Method to catch any axios errors for
 * @param errorType Default error type for unhandled errors
 * @returns Result of the method
 */
export async function catchAxiosErrors<T>(method: () => Promise<T>, errorType = CodecErrorType.ApiError): Promise<T> {
	try {
		return await method()
	} catch (e) {
		if (e && e.response) {
			if (e.response.status === 404) {
				errorType = CodecErrorType.NotFound
			}

			throw new CodecError(errorType, { status: e.response.status, message: e.response.data })
		}

		throw e
	}
}

/**
 * Types of information that can be included in a CodecError.
 */
export type CodecErrorInfo = CodecApiErrorInfo | undefined;

/**
 * A generic error that can be thrown by a codec, with an error type and optional information.
 */
export class CodecError extends Error {
	constructor(public type: CodecErrorType, public info?: CodecErrorInfo) {
		super(typeToString(type))
	}
}