import { HalResource, Page, Pageable, Sortable, Hub, SearchIndex, FacetsResponse, FacetQuery, FacetedContentItem } from 'dc-management-sdk-js';
export declare const DEFAULT_SIZE = 100;
/**
 * TOOD
 */
export interface StatusQuery {
    status?: 'ARCHIVED' | 'ACTIVE' | 'DELETED';
}
/**
 * TODO
 * @param pagableFn
 * @param options
 * @returns
 */
export declare const paginator: <T extends HalResource>(pagableFn: (options?: Pageable & Sortable & StatusQuery) => Promise<Page<T>>, options?: Pageable & Sortable & StatusQuery) => Promise<T[]>;
/**
 * TODO
 * @param query
 * @param hub
 * @returns
 */
export declare const facetPaginator: (query: FacetQuery, hub: Hub) => (options: any) => Promise<FacetsResponse<FacetedContentItem>>;
/**
 * TODO
 * @param hub
 * @returns
 */
export declare const searchIndexPaginator: (hub: Hub) => (options: any) => Promise<Page<SearchIndex>>;
/**
 * TODO
 * @param index
 * @returns
 */
export declare const replicaPaginator: (index: SearchIndex) => (options: any) => Promise<Page<SearchIndex>>;
