import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'
const actualAxios = jest.requireActual('axios')

export interface MockRequest {
	status?: number;
	data: string | object | ((method: string, config: AxiosRequestConfig, params: URLSearchParams) => object);
	headers?: object;
}

export interface MockRequests {
	[url: string]: MockRequest
}

export interface MockFixture {
	get?: MockRequests,
	post?: MockRequests,
	put?: MockRequests,
	patch?: MockRequests,
	delete?: MockRequests,
}

export interface Request {
	url: string;
	config: AxiosRequestConfig
}


const methods = ['get', 'put', 'post', 'delete', 'patch']

function combineUrls(baseUrl, relativeUrl) {
	if (!baseUrl) return relativeUrl

	return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}

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

		let request = methodRequests[urlWithParams]

		if (request == null) {
			request = methodRequests[fullUrl]
		}

		if (request == null) {
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

		let contentType
		let requestData = request.data

		if (typeof requestData === 'function') {
			requestData = requestData(method, config, urlObj.searchParams)
		}

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

export function mockAxios(axios: AxiosInstance, mockFixture: MockFixture, requests: Request[], baseConfig = {}) {
	for (const method of methods) {
		const methodRequests = mockFixture[method] ?? []
		const mock = axios[method] as jest.Mock
		
		mock.mockImplementation(getMockAxios(method, methodRequests, requests, baseConfig))
	}

	const reqMock = axios.request as jest.Mock

	reqMock.mockImplementation((config) => {
		const method = config.method.toLowerCase()
		const methodRequests = mockFixture[method] ?? []
		return getMockAxios(method, methodRequests, requests, baseConfig)(config.url, config)
	})
}

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