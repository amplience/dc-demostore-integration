"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteProductIdString = exports.quote = exports.isServer = exports.formatMoneyString = exports.sleep = void 0;
const __1 = require("..");
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
exports.sleep = sleep;
const formatMoneyString = (money, args) => {
    args = Object.assign(Object.assign({}, __1.defaultArgs), args);
    return new Intl.NumberFormat(args.locale, {
        style: 'currency',
        currency: args.currency
    }).format(money);
};
exports.formatMoneyString = formatMoneyString;
const isServer = () => {
    return typeof window === 'undefined';
};
exports.isServer = isServer;
const quote = (str) => `"${str}"`;
exports.quote = quote;
const quoteProductIdString = (productIds) => productIds.split(',').map(exports.quote).join(',');
exports.quoteProductIdString = quoteProductIdString;
