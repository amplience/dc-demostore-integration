import { defaultArgs } from "..";

export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

export const formatMoneyString = (money, args) => {
    args = {
        ...defaultArgs,
        ...args
    }
    return new Intl.NumberFormat(args.locale, {
        style: 'currency',
        currency: args.currency
    }).format(money);
}

export const isServer = (): boolean => {
    return typeof window === 'undefined';
}

export const quote = (str: string) => `"${str}"`
export const quoteProductIdString = (productIds: string) => productIds.split(',').map(quote).join(',')