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
 * @param baseUrl 
 * @param relativeUrl 
 * @returns 
 */
function combineUrls(baseUrl, relativeUrl) {
	if (!baseUrl) return relativeUrl

	return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}

/**
 * TODO
 * @param method 
 * @param methodRequests 
 * @param requests 
 * @param baseConfig 
 * @returns 
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
 * TODO
 * @param axios 
 * @param mockFixture 
 * @param requests 
 * @param baseConfig 
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
 * TODO
 * @param axios
 * @param requests 
 * @param mockFixture 
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
 * TODO
 * @param mappings 
 * @returns 
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