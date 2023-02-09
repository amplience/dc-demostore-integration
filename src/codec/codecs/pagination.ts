import { OAuthRestClientInterface } from '@/common'
import { AxiosRequestConfig, AxiosStatic } from 'axios'

type GetPageResult<T> = { data: T[], total: number }
type PropMapper = <T>(data: any) => T
type StringPropMapper = string | PropMapper

/**
 * Get an URL with added params from the given object.
 * @param url The original URL
 * @param params The params to append to the URL
 * @returns The URL with the added params
 */
function applyParams(url: string, params: any): string {
	const isRelative = url.startsWith('/')

	if (isRelative) {
		// TODO: better solution?
		url = 'http://a'+ url
	}

	const urlObj = new URL(url)

	for (const key of Object.keys(params)) {
		urlObj.searchParams.append(key, params[key])
	}

	url = urlObj.toString()

	if (isRelative) {
		url = url.substring(8)
	}

	return url
}

/**
 * Return a method that maps from an object to a property within it defined by the given string, if a custom one is not provided.
 * @param mapper Mapping string or method
 * @returns Mapping method
 */
function getPropMapper(mapper: StringPropMapper): PropMapper {
	if (typeof mapper === 'string') {
		return <T>(data: any) => data[mapper] as T
	}

	return mapper
}

/**
 * Return a generator for a function that gets a page from an oauth endpoint with query parameters.
 * @param offsetQuery Query key to use for item offset
 * @param countQuery Query key to use for page size
 * @param totalProp Property to extract total assets from
 * @param resultProp Property to extract result items from
 * @returns A generator that takes a client, url and base params and generates a function that gets a page.
 */
export function getPageByQuery(offsetQuery: string, countQuery: string, totalProp: StringPropMapper, resultProp: string) {
	const totalPropMap = getPropMapper(totalProp)
	const resultPropMap = getPropMapper(resultProp)

	return <T>(client: OAuthRestClientInterface, url: string, params: any = {}) => 
		async (page: number, pageSize: number): Promise<GetPageResult<T>> => {
			const allParams = {
				...params,
				[offsetQuery]: page * pageSize,
				[countQuery]: pageSize
			}

			const newUrl = applyParams(url, allParams)

			const response = await client.get({url: newUrl})

			return {
				data: resultPropMap(response),
				total: totalPropMap(response)
			}
		}
}

/**
 * Return a generator for a function that gets a page using an axios client with query parameters.
 * @param offsetQuery Query key to use for item offset
 * @param countQuery Query key to use for page size
 * @param totalProp Property to extract total assets from
 * @param resultProp Property to extract result items from
 * @returns A generator that takes a client, url and base params and generates a function that gets a page.
 */
export function getPageByQueryAxios(offsetQuery: string, countQuery: string, totalProp: StringPropMapper, resultProp: StringPropMapper) {
	const totalPropMap = getPropMapper(totalProp)
	const resultPropMap = getPropMapper(resultProp)

	return <T>(axios: AxiosStatic, url: string, config: AxiosRequestConfig<any>, params: any = {}) => 
		async (page: number, pageSize: number): Promise<GetPageResult<T>> => {
			const allParams = {
				...params,
				[offsetQuery]: page * pageSize,
				[countQuery]: pageSize
			}

			const newUrl = applyParams(url, allParams)

			const response = await axios.get(newUrl, config)

			return {
				data: resultPropMap(response.data),
				total: totalPropMap(response.data)
			}
		}
}

/**
 * Iterate through fetching pages and build an array out of the results.
 * @param requestPage Method to use to request pages. Takes page number and size. Must return at least one page-size worth of items if the total allows it.
 * @param pageSize Page size (default: 20)
 * @param pageNum Page number to start at (default: 0)
 * @param pageCount Number of pages to fetch (default: all)
 * @returns List of items fetched from the paginated endpoint
 */
export async function paginate<T>(
	requestPage: (page: number, pageSize: number) => Promise<GetPageResult<T>>,
	pageSize = 20,
	pageNum = 0,
	pageCount?: number
): Promise<T[]> {
	const result: T[] = []

	if (pageCount === undefined) {
		pageCount = Infinity
	}

	const startOffset = pageNum * pageSize
	const targetCount = pageCount * pageSize

	for (let i = 0; i < pageCount; i++) {
		const {data, total} = await requestPage(pageNum + i, pageSize)
		
		// There's a possibility that the implementation has returned more than one page.
		// Allow multiple pages to be completed at a time.
		const pagesReturned = Math.floor(data.length / pageCount)

		let dataCount = data.length

		if (pagesReturned > 0) {
			dataCount = pagesReturned * pageCount
			i += pagesReturned - 1
		}

		const targetMin = Math.min(total - startOffset, targetCount)
		const end = targetMin - result.length
		const toAdd = Math.min(dataCount, end)

		result.push(...(data.slice(0, toAdd)))

		if (result.length === targetMin) {
			break
		}
	}

	return result
}