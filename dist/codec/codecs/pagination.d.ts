import { OAuthRestClientInterface } from '@/common';
import { AxiosRequestConfig, AxiosStatic } from 'axios';
declare type GetPageResult<T> = {
    data: T[];
    total: number;
};
export declare function getPageByQuery(offsetQuery: string, countQuery: string, totalProp: string, resultProp: string): <T>(client: OAuthRestClientInterface, url: string, params?: any) => (page: number, pageSize: number) => Promise<GetPageResult<T>>;
export declare function getPageByQueryAxios(offsetQuery: string, countQuery: string, totalProp: string, resultProp: string): <T>(axios: AxiosStatic, url: string, config: AxiosRequestConfig<any>, params?: any, dataMutator?: (data: any) => T[]) => (page: number, pageSize: number) => Promise<GetPageResult<T>>;
export declare function paginate<T>(requestPage: (page: number, pageSize: number) => Promise<GetPageResult<T>>, pageSize?: number, pageNum?: number, pageCount?: number): Promise<T[]>;
export {};
