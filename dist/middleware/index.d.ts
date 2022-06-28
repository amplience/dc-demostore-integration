import { CommerceAPI } from "../index";
export declare type Config = ConfigLocatorBlock | any | undefined;
export declare type ConfigLocatorBlock = {
    config_locator: string;
};
export declare const baseConfigLocator: {
    config_locator: string;
};
export declare type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups';
export declare const getCommerceAPI: (params?: Config) => Promise<CommerceAPI>;
export declare const apiRouteHandler: (req: any, res: any) => Promise<any>;
