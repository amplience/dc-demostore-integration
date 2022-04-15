"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoneyString = exports.sleep = void 0;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
exports.sleep = sleep;
const formatMoneyString = (money, args) => {
    return new Intl.NumberFormat(args.locale, {
        style: 'currency',
        currency: args.currency
    }).format(money);
};
exports.formatMoneyString = formatMoneyString;
