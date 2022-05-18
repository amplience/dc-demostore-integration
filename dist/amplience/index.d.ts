import { DemoStoreConfiguration } from '../common/types';
import { ContentItem } from 'dc-management-sdk-js';
export declare const getContentItem: (hub: string, args: any) => Promise<ContentItem>;
export declare const getDemoStoreConfig: (key: string) => Promise<DemoStoreConfiguration>;
