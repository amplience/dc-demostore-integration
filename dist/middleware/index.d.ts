import { CommerceAPI } from '../index';
/**
 * TODO
 */
export declare type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups' | 'getVariants' | 'getRawProducts';
/**
 * TODO
 * @param params
 * @returns
 */
export declare const getCommerceAPI: (params?: any) => Promise<CommerceAPI>;
/**
 * TODO
 * @param req
 * @param res
 * @returns
 */
export declare const middleware: (req: any, res: any) => Promise<any>;
export default middleware;
