import { formatMoneyString, isServer, quote, quoteProductIdString, sleep } from './util'

describe('sleep', function() {
	test('sleeps for 500ms', async () => {
		const time = Date.now()
		await sleep(500)
		// Should be more than 498ms
		expect(Date.now() - time).toBeGreaterThan(498)
	})

	test('sleeps for 0ms', async () => {
		const time = Date.now()
		await sleep(0)
		// Should be less than 3ms
		expect(Date.now() - time).toBeLessThan(3)
	})
})

describe('formatMoneyString', function() {
	test('should format money based on locale and currency', () => {
		expect(formatMoneyString('2.00', { locale: 'en-US' })).toEqual('$2.00')
		expect(formatMoneyString('2.00', { locale: 'en-GB' })).toEqual('US$2.00')
		expect(formatMoneyString('2.00', { locale: 'en-GB', currency: 'GBP' })).toEqual('£2.00')
		expect(formatMoneyString('2.00', { locale: 'en-GB', currency: 'EUR' })).toEqual('€2.00')
		expect(formatMoneyString('2.00', { locale: 'en-US', currency: 'GBP' })).toEqual('£2.00')
	})

	test('throws on invalid currency code', () => {
		expect(() => formatMoneyString('2.00', { locale: 'en-GB', currency: 'wrong' })).toThrow()
	})
})

describe('isServer', function() {
	test('true when window is undefined', () => {
		expect(isServer()).toBeTruthy()
	})

	test('false when window is defined', () => {
		global.window = {} as any
		expect(isServer()).toBeFalsy()
		delete global.window
	})
})

describe('quote', function() {
	test('quotes a string', () => {
		expect(quote('hello')).toEqual('"hello"')
		expect(quote('another string')).toEqual('"another string"')
		expect(quote('"')).toEqual('"""')
	})

	test('quotes the empty string', () => {
		expect(quote('')).toEqual('""')
	})
})

describe('quoteProductIdString', function() {
	test('quotes one string', () => {
		expect(quoteProductIdString('hello')).toEqual('"hello"')
		expect(quoteProductIdString('another string')).toEqual('"another string"')
		expect(quoteProductIdString('"')).toEqual('"""')
	})

	test('quotes many strings', () => {
		expect(quoteProductIdString('comma,separated')).toEqual('"comma","separated"')
		expect(quoteProductIdString('even,more,strings,here')).toEqual('"even","more","strings","here"')
	})

	test('quotes the empty string', () => {
		expect(quoteProductIdString('')).toEqual('""')
	})
})