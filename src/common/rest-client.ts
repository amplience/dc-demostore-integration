import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { sleep } from '../common/util'
import _ from 'lodash'
import { logResponse } from '../codec/codecs/common'
import { CodecPropertyConfig } from '../codec/codecs/core'
import { HttpMethod } from 'dc-management-sdk-js'
import { StringProperty, StringPatterns } from '../codec/cms-property-types'
import { CodecError, CodecErrorType, catchAxiosErrors } from '../codec/codecs/codec-error'

/**
 * Configuration interface with an API url.
 */
export type APIConfiguration = {
    api_url:        StringProperty
}

/**
 * Configuration interface with an API and Auth url.
 */
export type OAuthCodecConfiguration = APIConfiguration & {
    auth_url:       StringProperty
}

/**
 * Configuration interface with an API, Auth and credentials.
 */
export type ClientCredentialsConfiguration = OAuthCodecConfiguration & {
    client_id:      StringProperty
    client_secret:  StringProperty
}

/**
 * Configuration interface with a username and password.
 */
export type UsernamePasswordConfiguration = {
    username:   StringProperty
    password:   StringProperty
}

/**
 * JSON schema properties describing UsernamePasswordConfiguration.
 */
export const UsernamePasswordProperties: UsernamePasswordConfiguration = {
	username: {
		title: 'Username',
		type: 'string',
		minLength: 1
	},
	password: {
		title: 'Password',
		type: 'string',
		minLength: 1
	}
}

/**
 * JSON schema properties describing APIConfiguration.
 */
export const APIProperties: APIConfiguration = {
	api_url: {
		title: 'Base API URL',
		type: 'string',
		pattern: StringPatterns.httpUrl
	}
}

/**
 * JSON schema properties describing OAuthCodecConfiguration.
 */
export const OAuthProperties: OAuthCodecConfiguration = {
	...APIProperties,
	auth_url: {
		title: 'Oauth URL',
		type: 'string',
		pattern: StringPatterns.httpUrl
	}
}

/**
 * JSON schema properties describing client credential OAuth properties.
 */
export const ClientCredentialProperties: ClientCredentialsConfiguration = {
	...OAuthProperties,
	client_id: {
		title: 'Client ID',
		type: 'string',
		minLength: 1
	},
	client_secret: {
		title: 'Client secret',
		type: 'string',
		minLength: 1
	}
}

/**
 * Interface for a REST client with all HTTP methods.
 */
export type OAuthRestClientInterface = {
    [Z in keyof typeof HttpMethod as Lowercase<Z>]: (config: AxiosRequestConfig | string) => Promise<any>
}

type AuthenticationStatus = 'NOT_LOGGED_IN' | 'LOGGING_IN' | 'LOGGED_IN'

/**
 * A REST client with OAuth authentication and methods for each request type.
 */
export const OAuthRestClient = (config: CodecPropertyConfig<OAuthCodecConfiguration>, payload: any, requestConfig: AxiosRequestConfig = {}, getHeaders?: (auth: any) => any): OAuthRestClientInterface => {
	let authenticatedAxios: AxiosInstance
	let status: AuthenticationStatus = 'NOT_LOGGED_IN'
	let expiryTime = 0

	/**
	 * Get an authenticated axios client.
	 * If not created yet, create and authenticate an axios instance using OAuth.
	 * Automatically re-authenticates this client when the token is about to expire.
	 * @returns An authenticated axios client.
	 */
	const authenticate = async (): Promise<AxiosInstance> => {
		if (!authenticatedAxios || Date.now() > expiryTime) {
			const auth = await catchAxiosErrors(async () => {
				const response = await axios.post(config.auth_url, payload, requestConfig)
				return logResponse('post', config.auth_url, response.data)
			}, CodecErrorType.AuthError)

			if (!getHeaders) {
				getHeaders = (auth: any) => ({
					Authorization: `${auth.token_type || 'Bearer'} ${auth.access_token}`
				})
			}

			authenticatedAxios = axios.create({
				baseURL: config.api_url,
				headers: getHeaders(auth)
			})

			expiryTime = Date.now() + auth.expires_in * 999
		}
		return authenticatedAxios
	}

	/**
	 * Create an HTTP request function using the given HTTP method.
	 * @param method HTTP method
	 * @returns HTTP request function, takes axios config or an URL.
	 */
	const request = (method: HttpMethod) => async (config: AxiosRequestConfig | string): Promise<any> => {
		if (typeof config === 'string') {
			config = { url: config }
		}

		// authentication
		switch (status) {
		case 'LOGGING_IN':
			await sleep(100)
			return await request(method)(config)

		case 'NOT_LOGGED_IN':
			status = 'LOGGING_IN'
			break

		case 'LOGGED_IN':
			break
		}

		authenticatedAxios = await authenticate()

		if (status === 'LOGGING_IN') {
			status = 'LOGGED_IN'
		}

		try {
			// console.log(`[ rest ] get ${config.url}`)
			return logResponse(method, config.url, await (await authenticatedAxios.request({ method, ...config })).data)
		} catch (error: any) {
			if (error.response?.status === 429) {
				await sleep(1000)
				return await request(method)(config)
			}
			else if (error.response?.status === 404) {
				// don't throw on a 404 just return an empty result set
				return null
			}

			// if (error.stack) {
			//     console.log(error.stack)
			// }

			throw new CodecError(CodecErrorType.ApiError, {
				status: error.response?.status,
				message: error.response?.data
			})
		}
	}

	return {
		get:    request(HttpMethod.GET),
		delete: request(HttpMethod.DELETE),
		put:    request(HttpMethod.PUT),
		post:   request(HttpMethod.POST),
		patch:  request(HttpMethod.PATCH)
	}
}

export default OAuthRestClient