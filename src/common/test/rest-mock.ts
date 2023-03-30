import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'
import { isEqual } from 'lodash'
const actualAxios = jest.requireActual('axios')

/**
 * Mock request object type
 */
export interface MockRequest {
	status?: number;
	data: string | object;
	headers?: object;
}

/**
 * Mock request or function returning a mock request
 */
export type MockRequestOrFunction = MockRequest | ((config: AxiosRequestConfig) => MockRequest)

/**
 * Object matching urls with mock requests or functions
 */
export interface MockRequests {
	[url: string]: MockRequestOrFunction
}

/**
 * Mock fixture object matching request methods with mock requests
 */
export interface MockFixture {
	get?: MockRequests,
	post?: MockRequests,
	put?: MockRequests,
	patch?: MockRequests,
	delete?: MockRequests,
}

/**
 * Axios request type
 */
export interface Request {
	url: string;
	config: AxiosRequestConfig
}

/**
 * Object mapping data with a mock request
 */
interface DataResponseMapping {
	data: any,
	response: MockRequest
}

// http methods
const methods = ['get', 'put', 'post', 'delete', 'patch']

// http data methods
const dataMethods = ['put', 'post', 'patch']

/**
 * Combine a base url with a relative url
 * @param baseUrl Base URL
 * @param relativeUrl Relative URL
 * @returns Combined URL
 */
function combineUrls(baseUrl, relativeUrl) {
	if (!baseUrl) return relativeUrl

	return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}

/**
 * Get a mock axios method with the given set of mocked requests, requests out array, and base config.
 * @param method HTTP method
 * @param methodRequests Mocked requests for this method
 * @param requests Array to place requests from calls into
 * @param baseConfig Base axios configuration
 * @returns Mocked axios method
 */
function getMockAxios(method: string, methodRequests: MockRequests, requests: Request[], baseConfig: object) {
	return (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
		config = { ...baseConfig, ...config, url: url }

		const urlWithParams = combineUrls(config.baseURL, url)
		const urlObj = new URL(urlWithParams)

		const keys = Array.from(urlObj.searchParams.keys())

		for (const key of keys) {
			urlObj.searchParams.delete(key)
		}

		const fullUrl = urlObj.toString()

		requests.push({
			url: urlWithParams,
			config
		})

		let requestF = methodRequests[urlWithParams]

		if (requestF == null) {
			requestF = methodRequests[fullUrl]
		}

		if (requestF == null) {
			return Promise.reject({
				config,
				response: {
					status: 404,
					statusText: 'Not Found',
					data: {},
					headers: {},
					config
				}
			})
		}

		const request = (typeof requestF == 'function') ? requestF(config) : requestF

		let contentType
		const requestData = request.data

		if (typeof requestData === 'object') {
			contentType = 'application/json'
		}

		return Promise.resolve({
			status: request.status ?? 200,
			statusText: 'OK',
			data: request.data,
			headers: { 'content-type': contentType, ...request.headers },
			config
		})
	}
}

/**
 * Mock the methods of an axios instance
 * @param axios Axios instance
 * @param mockFixture Fixture containing mocked requests and responses
 * @param requests Array to place requests from calls into
 * @param baseConfig Base axios configuration
 */
export function mockAxios(axios: AxiosInstance, mockFixture: MockFixture, requests: Request[], baseConfig = {}) {
	for (const method of methods) {
		const methodRequests = mockFixture[method] ?? []
		const mock = axios[method] as jest.Mock

		if (dataMethods.indexOf(method) !== -1) {
			mock.mockImplementation((url: string, data: any, config: AxiosRequestConfig) => {
				if (config == null) {
					config = {}
				}

				config.data = data

				return getMockAxios(method, methodRequests, requests, baseConfig)(url, config)
			})
		} else {
			mock.mockImplementation(getMockAxios(method, methodRequests, requests, baseConfig))
		}
	}

	const reqMock = axios.request as jest.Mock

	reqMock.mockImplementation((config) => {
		const method = config.method.toLowerCase()
		const methodRequests = mockFixture[method] ?? []
		return getMockAxios(method, methodRequests, requests, baseConfig)(config.url, config)
	})
}

/**
 * Mock the methods of the static axios class.
 * @param axios Static axios object
 * @param requests Array to place requests from calls into
 * @param mockFixture Fixture containing mocked requests and responses
 */
export function massMock(axios: AxiosStatic, requests: Request[], mockFixture: MockFixture) {
	mockAxios(axios, mockFixture, requests)

	const mockCreate = axios.create as jest.Mock
	mockCreate.mockImplementation((config) => {
		const client = actualAxios.create(config)

		for (const method of methods) {
			client[method] = jest.fn()
		}

		client.request = jest.fn()

		mockAxios(client, mockFixture, requests, config)

		return client
	})
}

/**
 * Helper method that returns a function mapping from axios request data to a specific response.
 * Useful for having POST data specific responses for requests to the same endpoint.
 * @param mappings Data to response mapping
 * @returns A method that finds a matching response given the input axios request config.
 */
export function dataToResponse(mappings: DataResponseMapping[]): (config: AxiosRequestConfig) => MockRequest {
	return (config) => {
		const matching = mappings.find(mapping => isEqual(mapping.data, config.data))

		if (!matching) {
			throw new Error('Unrecognized request data.')
		}

		return matching.response
	}
}