"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenConfig = exports.quoteProductIdString = exports.quote = exports.isServer = exports.formatMoneyString = exports.sleep = void 0;
const default_args_1 = require("./default-args");
/**
 * Sleep for a period of time in milliseconds.
 * @param delay Delay in milliseconds
 * @returns Promise that resolves after the delay
 */
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
exports.sleep = sleep;
/**
 * Format a value with the given currency argument
 * @param money Value to format as currency
 * @param args.currency Currency type
 * @returns Formatted value
 */
const formatMoneyString = (money, args) => new Intl.NumberFormat(args.locale, {
    style: 'currency',
    currency: args.currency || default_args_1.defaultArgs.currency
}).format(money);
exports.formatMoneyString = formatMoneyString;
/**
 * Determine if the code is running on a server.
 * @returns False if the code is running on a browser, true otherwise.
 */
const isServer = () => typeof window === 'undefined';
exports.isServer = isServer;
/**
 * Surround a string in double quotes.
 * @param str Input string
 * @returns String surrounded in quotes
 */
const quote = (str) => `"${str}"`;
exports.quote = quote;
/**
 * Surround elements of a comma separated list in double quotes.
 * @param productIds Comma separated list
 * @returns Comma separated list with quoted items
 */
const quoteProductIdString = (productIds) => productIds.split(',').map(exports.quote).join(',');
exports.quoteProductIdString = quoteProductIdString;
const flattenConfig = (params = undefined) => {
    let codec = params;
    if (params.codec_params) {
        codec = Object.assign(Object.assign({}, params.codec_params), { vendor: params.vendor });
    }
    return codec;
};
exports.flattenConfig = flattenConfig;
