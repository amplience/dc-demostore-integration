import { CommerceAPI, Config } from "../index";
export declare const baseConfigLocator: string;
export declare type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups';
export declare const getCommerceAPI: (params?: Config) => Promise<CommerceAPI>;
declare const handler: (req: any, res: any) => Promise<any>;
export default handler;
