"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteProductIdString = exports.quote = exports.isServer = exports.formatMoneyString = exports.sleep = void 0;
const __1 = require("..");
/**
 * TODO
 * @param delay
 * @returns
 */
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
exports.sleep = sleep;
/**
 * TODO
 * @param money
 * @param args
 * @returns
 */
const formatMoneyString = (money, args) => new Intl.NumberFormat(args.locale, {
    style: 'currency',
    currency: args.currency || __1.defaultArgs.currency
}).format(money);
exports.formatMoneyString = formatMoneyString;
/**
 * TODO
 * @returns
 */
const isServer = () => typeof window === 'undefined';
exports.isServer = isServer;
/**
 * TODO
 * @param str
 * @returns
 */
const quote = (str) => `"${str}"`;
exports.quote = quote;
/**
 * TODO
 * @param productIds
 * @returns
 */
const quoteProductIdString = (productIds) => productIds.split(',').map(exports.quote).join(',');
exports.quoteProductIdString = quoteProductIdString;
