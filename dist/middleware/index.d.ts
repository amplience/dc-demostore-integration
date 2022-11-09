import { CommerceAPI } from '../index';
export declare type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups' | 'getVariants';
export declare const getCommerceAPI: (params?: any) => Promise<CommerceAPI>;
export declare const middleware: (req: any, res: any) => Promise<any>;
export default middleware;
