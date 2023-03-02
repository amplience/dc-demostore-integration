import { OAuthRestClientInterface } from '@/common';
import { AxiosRequestConfig, AxiosStatic } from 'axios';
declare type GetPageResult<T> = {
    data: T[];
    total: number;
};
declare type PropMapper = <T>(data: any) => T;
declare type StringPropMapper = string | PropMapper;
/**
 * Return a generator for a function that gets a page from an oauth endpoint with query parameters.
 * @param offsetQuery Query key to use for item offset
 * @param countQuery Query key to use for page size
 * @param totalProp Property to extract total assets from
 * @param resultProp Property to extract result items from
 * @returns A generator that takes a client, url and base params and generates a function that gets a page.
 */
export declare function getPageByQuery(offsetQuery: string, countQuery: string, totalProp: StringPropMapper, resultProp: StringPropMapper): <T>(client: OAuthRestClientInterface, url: string, params?: any) => (page: number, pageSize: number) => Promise<GetPageResult<T>>;
/**
 * Return a generator for a function that gets a page using an axios client with query parameters.
 * @param offsetQuery Query key to use for item offset
 * @param countQuery Query key to use for page size
 * @param totalProp Property to extract total assets from
 * @param resultProp Property to extract result items from
 * @returns A generator that takes a client, url and base params and generates a function that gets a page.
 */
export declare function getPageByQueryAxios(offsetQuery: string, countQuery: string, totalProp: StringPropMapper, resultProp: StringPropMapper): <T>(axios: AxiosStatic, url: string, config: AxiosRequestConfig<any>, params?: any) => (page: number, pageSize: number) => Promise<GetPageResult<T>>;
/**
 * Iterate through fetching pages and build an array out of the results.
 * @param requestPage Method to use to request pages. Takes page number and size. Must return at least one page-size worth of items if the total allows it.
 * @param pageSize Page size (default: 20)
 * @param pageNum Page number to start at (default: 0)
 * @param pageCount Number of pages to fetch (default: all)
 * @returns List of items fetched from the paginated endpoint
 */
export declare function paginate<T>(requestPage: (page: number, pageSize: number) => Promise<GetPageResult<T>>, pageSize?: number, pageNum?: number, pageCount?: number): Promise<T[]>;
export {};
