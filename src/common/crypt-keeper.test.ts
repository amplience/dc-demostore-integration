import { CryptKeeper } from './crypt-keeper'

describe('CryptKeeper', function() {
	test('can encrypt and decrypt with the same input config', () => {
		const config = {
			_meta: {
				deliveryId: '229845ae-7182-42cc-831e-2d4e8bbbdf34',
				schema: 'test.json'
			}
		}

		const keeper1 = CryptKeeper(config, 'hub1')
		const keeper2 = CryptKeeper(config, 'hub1')

		expect(keeper2.decrypt(keeper1.encrypt('example text to encrypt'))).toEqual('example text to encrypt')
	})

	test('hash function does not change', () => {
		const config = {
			_meta: {
				deliveryId: '229845ae-7182-42cc-831e-2d4e8bbbdf34',
				schema: 'test.json'
			}
		}

		const keeper1 = CryptKeeper(config, 'hub1')

		expect(keeper1.encrypt('example text to encrypt')).toMatchInlineSnapshot(`"===>)?f3^c8!}Kpz:}3d+Cy#3Z9_;'4Ke>A'=r&%J(<@^eIbG9I"ZqK&^\`)<'v5Dua&==="`)
		expect(keeper1.encrypt('an additional encryption example')).toMatchInlineSnapshot(`"===ll8Z"+}9>ZI$!&K$A<+b<+g3J?_2q^2_x"K)}*:e@GC6u%G?>|KEE&%;xvBqfaHK9u8HH5DJJ>!2fg\`)<'v5Dua&==="`)
	})

	test('cannot encrypt and decrypt with different input config', () => {
		const config = {
			_meta: {
				deliveryId: '229845ae-7182-42cc-831e-2d4e8bbbdf34',
				schema: 'test.json'
			}
		}

		const config2 = {
			_meta: {
				deliveryId: '229845ae-7182-42cc-831e-2d4e8bbbdf34',
				schema: 'different.json'
			}
		}

		const config3 = {
			_meta: {
				deliveryId: '229845ae-7182-42cc-831e-aaaaaaaaaaaa',
				schema: 'test.json'
			}
		}

		const keeper1 = CryptKeeper(config, 'hub1')
		const keeper2 = CryptKeeper(config2, 'hub1')
		const keeper3 = CryptKeeper(config3, 'hub1')
		const keeper4 = CryptKeeper(config, 'hub2')

		expect(keeper2.decrypt(keeper1.encrypt('example text to encrypt'))).not.toEqual('example text to encrypt')
		expect(keeper3.decrypt(keeper1.encrypt('example text to encrypt'))).not.toEqual('example text to encrypt')
		expect(keeper4.decrypt(keeper1.encrypt('example text to encrypt'))).not.toEqual('example text to encrypt')
	})

	test('decryptAll operates on all properties of an object', () => {
		const configSource = {
			_meta: {
				deliveryId: '229845ae-7182-42cc-831e-2d4e8bbbdf34',
				schema: 'test.json'
			}
		}
		const config = {
			...configSource
		}
		const keeper1 = CryptKeeper(config, 'hub1')

		const object = {
			example: 'test',
			example2: 'another'
		}

		const result = {
			example: keeper1.encrypt(object.example),
			example2: keeper1.encrypt(object.example2)
		}

		Object.assign(config, result)

		expect(result).not.toEqual(object)
		expect(keeper1.decryptAll()).toEqual({...configSource, ...object})
	})
})