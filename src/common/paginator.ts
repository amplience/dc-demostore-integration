import { HalResource, Page, Pageable, Sortable, Hub, SearchIndex, FacetsResponse, FacetQuery, FacetedContentItem } from 'dc-management-sdk-js';

export const DEFAULT_SIZE = 100;

export interface StatusQuery {
    status?: 'ARCHIVED' | 'ACTIVE' | 'DELETED';
}

export const paginator = async <T extends HalResource>(
    pagableFn: (options?: Pageable & Sortable & StatusQuery) => Promise<Page<T>>,
    options: Pageable & Sortable & StatusQuery = {}
): Promise<T[]> => {
    const currentPage = await pagableFn({ ...options, size: DEFAULT_SIZE });
    if (
        currentPage.page &&
        currentPage.page.number !== undefined &&
        currentPage.page.totalPages !== undefined &&
        currentPage.page.number + 1 < currentPage.page.totalPages
    ) {
        return [
            ...currentPage.getItems(),
            ...(await paginator(pagableFn, { ...options, page: currentPage.page.number + 1 }))
        ];
    }
    return currentPage.getItems();
};

export const facetPaginator = (query: FacetQuery, hub: Hub) => (options: any): Promise<FacetsResponse<FacetedContentItem>> => hub.related.contentItems.facet(query, options)
export const searchIndexPaginator = (hub: Hub) => (options: any): Promise<Page<SearchIndex>> => hub.related.searchIndexes.list(undefined, undefined, options)
export const replicaPaginator = (index: SearchIndex) => (options: any): Promise<Page<SearchIndex>> => index.related.replicas.list(undefined, options)