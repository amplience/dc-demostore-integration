import { defaultArgs } from '..'

/**
 * TODO
 * @param delay 
 * @returns 
 */
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

/**
 * TODO
 * @param money 
 * @param args 
 * @returns 
 */
export const formatMoneyString = (money, args) => new Intl.NumberFormat(args.locale, {
	style: 'currency',
	currency: args.currency || defaultArgs.currency
}).format(money)

/**
 * TODO
 * @returns 
 */
export const isServer = (): boolean => typeof window === 'undefined'

/**
 * TODO
 * @param str 
 * @returns 
 */
export const quote = (str: string) => `"${str}"`

/**
 * TODO
 * @param productIds 
 * @returns 
 */
export const quoteProductIdString = (productIds: string) => productIds.split(',').map(quote).join(',')