import { DemoStoreConfiguration } from '../types';
import { ContentItem } from 'dc-management-sdk-js';
export declare class AmplienceClient {
    hub: string;
    environment: string;
    constructor(key: string);
    getContentItem(args: any): Promise<ContentItem>;
    getConfig(): Promise<DemoStoreConfiguration>;
}
