import { DemoStoreConfiguration } from '../common/types';
export declare const getContentItem: (hub: string, args: any) => Promise<any>;
export declare const getContentItemFromConfigLocator: (configLocator: string) => Promise<any>;
export declare const getDemoStoreConfig: (key: string) => Promise<DemoStoreConfiguration>;
