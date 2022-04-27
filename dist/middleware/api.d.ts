import { CommerceAPI, Config, DemoStoreConfiguration } from "../index";
export declare const getConfig: (configLocator: string) => Promise<DemoStoreConfiguration>;
export declare const getCommerceAPI: (params: Config) => CommerceAPI;
declare const handler: (req: any, res: any) => Promise<any>;
export default handler;
