/**
 * Sleep for a period of time in milliseconds.
 * @param delay Delay in milliseconds
 * @returns Promise that resolves after the delay
 */
export declare const sleep: (delay: number) => Promise<unknown>;
/**
 * Format a value with the given currency argument
 * @param money Value to format as currency
 * @param args.currency Currency type
 * @returns Formatted value
 */
export declare const formatMoneyString: (money: any, args: any) => string;
/**
 * Determine if the code is running on a server.
 * @returns False if the code is running on a browser, true otherwise.
 */
export declare const isServer: () => boolean;
/**
 * Surround a string in double quotes.
 * @param str Input string
 * @returns String surrounded in quotes
 */
export declare const quote: (str: string) => string;
/**
 * Surround elements of a comma separated list in double quotes.
 * @param productIds Comma separated list
 * @returns Comma separated list with quoted items
 */
export declare const quoteProductIdString: (productIds: string) => string;
export declare const flattenConfig: (params?: any) => any;
