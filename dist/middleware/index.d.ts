import { CommerceAPI } from '../index';
/**
 * Commerce API method names.
 */
export declare type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getCategoryTree' | 'getCustomerGroups' | 'getRawProducts';
export interface MiddlewareError {
    type: string;
    message: string;
    info?: object;
}
/**
 * Get a Commerce API for the given configuration.
 * @param params Configuration object and vendor
 * @returns Commerce API matching the configuration.
 */
export declare const getCommerceAPI: (params?: any) => Promise<CommerceAPI>;
/**
 * Integration middleware request handler. Provides access to commerce api methods.
 * @param req Request object
 * @param res Response object
 * @returns Response
 */
export declare const middleware: (req: any, res: any) => Promise<any>;
export default middleware;
