import { HalResource, Page, Pageable, Sortable, Hub, SearchIndex, FacetsResponse, FacetQuery, FacetedContentItem } from 'dc-management-sdk-js';
export declare const DEFAULT_SIZE = 100;
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
export declare const paginator: <T extends HalResource>(pagableFn: (options?: Pageable & Sortable & StatusQuery) => Promise<Page<T>>, options?: Pageable & Sortable & StatusQuery) => Promise<T[]>;
/**
 * Paginates the Dynamic Content facet method with a given query.
 * @param query Facet query
 * @param hub Target hub
 * @returns List of faceted content items
 */
export declare const facetPaginator: (query: FacetQuery, hub: Hub) => (options: any) => Promise<FacetsResponse<FacetedContentItem>>;
/**
 * Paginates the Dynamic Content search index list method with a given hub.
 * @param hub The hub to list search indexes for
 * @returns List of search indexes
 */
export declare const searchIndexPaginator: (hub: Hub) => (options: any) => Promise<Page<SearchIndex>>;
/**
 * Paginates the Dynamic Content replica list method with a given search index.
 * @param index The search index to list replicas for
 * @returns List of search index replicas.
 */
export declare const replicaPaginator: (index: SearchIndex) => (options: any) => Promise<Page<SearchIndex>>;
