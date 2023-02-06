import { DemoStoreConfiguration } from '../common/types';
/**
 * TODO
 * @param hub
 * @param args
 * @returns
 */
export declare const getContentItem: (hub: string, args: any) => Promise<any>;
/**
 * TODO
 * @param configLocator
 * @returns
 */
export declare const getContentItemFromConfigLocator: (configLocator: string) => Promise<any>;
/**
 * TODO
 * @param key
 * @returns
 */
export declare const getDemoStoreConfig: (key: string) => Promise<DemoStoreConfiguration>;
export declare const getConfig: (key: string) => Promise<DemoStoreConfiguration>;
