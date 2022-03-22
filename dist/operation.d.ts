import { QueryContext } from "./types";
import { CodecConfiguration } from './codec/codec';
/**
 * The base class for all operations.
 *
 * @public
 */
export declare class Operation {
    config: CodecConfiguration;
    constructor(config: CodecConfiguration);
    import(native: any): any;
    export(context: QueryContext): (native: any) => any;
    get(context: QueryContext): Promise<any>;
    post(context: QueryContext): Promise<any>;
    put(context: QueryContext): Promise<any>;
    delete(context: QueryContext): Promise<any>;
    getURL(context: QueryContext): string;
    getBaseURL(): void;
    getRequestPath(context: QueryContext): string;
    getRequest(context: QueryContext): string;
    postProcessor(context: QueryContext): (native: any) => any;
    doRequest(context: QueryContext): Promise<any>;
    translateResponse(data: any, arg1: any): void;
    getHeaders(): {};
    formatMoneyString(money: any, args: any): string;
}
