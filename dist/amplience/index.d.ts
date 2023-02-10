import { DemoStoreConfiguration } from '../common/types';
/**
 * Get a content item from a Dynamic Content hub.
 * @param hub Dynamic Content hub
 * @param args ID or key of the content item
 * @returns
 */
export declare const getContentItem: (hub: string, args: any) => Promise<any>;
/**
 * Gets the demostore config content item given a configLocator string.
 * @param configLocator Locator to use as part of the delivery key
 * @returns Demostore config content item
 */
export declare const getContentItemFromConfigLocator: (configLocator: string) => Promise<any>;
/**
 * Gets the demostore config given a key string.
 * @param key Locator to use as part of the delivery key
 * @returns Demostore config object
 */
export declare const getDemoStoreConfig: (key: string) => Promise<DemoStoreConfiguration>;
export declare const getConfig: (key: string) => Promise<DemoStoreConfiguration>;
