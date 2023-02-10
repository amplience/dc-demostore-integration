import {
	HalResource,
	Page, 
	Pageable, 
	Sortable, 
	Hub, 
	SearchIndex, 
	FacetsResponse, 
	FacetQuery, 
	FacetedContentItem
} from 'dc-management-sdk-js'

export const DEFAULT_SIZE = 100

/**
 * Status for Dynamic Content resources.
 */
export interface StatusQuery {
	status?: 'ARCHIVED' | 'ACTIVE' | 'DELETED';
}

/**
 * Paginates Dynamic Content fetch methods.
 * @param pagableFn Method to paginate with
 * @param options Options to pass to the function.
 * @returns Array of the requested resource type.
 */
export const paginator = async <T extends HalResource>(
	pagableFn: (options?: Pageable & Sortable & StatusQuery) => Promise<Page<T>>,
	options: Pageable & Sortable & StatusQuery = {}
): Promise<T[]> => {
	const currentPage = await pagableFn({ ...options, size: DEFAULT_SIZE })
	if (
		currentPage.page &&
		currentPage.page.number !== undefined &&
		currentPage.page.totalPages !== undefined &&
		currentPage.page.number + 1 < currentPage.page.totalPages
	) {
		return [
			...currentPage.getItems(),
			...(await paginator(pagableFn, { ...options, page: currentPage.page.number + 1 }))
		]
	}
	return currentPage.getItems()
}

/**
 * Paginates the Dynamic Content facet method with a given query.
 * @param query Facet query
 * @param hub Target hub
 * @returns List of faceted content items
 */
export const facetPaginator = (query: FacetQuery, hub: Hub) => (options: any): Promise<FacetsResponse<FacetedContentItem>> => hub.related.contentItems.facet(query, options)

/**
 * Paginates the Dynamic Content search index list method with a given hub.
 * @param hub The hub to list search indexes for
 * @returns List of search indexes
 */
export const searchIndexPaginator = (hub: Hub) => (options: any): Promise<Page<SearchIndex>> => hub.related.searchIndexes.list(undefined, undefined, options)

/**
 * Paginates the Dynamic Content replica list method with a given search index.
 * @param index The search index to list replicas for
 * @returns List of search index replicas.
 */
export const replicaPaginator = (index: SearchIndex) => (options: any): Promise<Page<SearchIndex>> => index.related.replicas.list(undefined, options)