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

		expect(keeper1.decrypt('===D(>w|#K`}((EaGdv("Be7IIu>Kr(e3g~_9`{sC$p{Gd8c\'AH:G:{9g`)<\'v5Dua&===')).toEqual('example text to encrypt')
		expect(keeper1.decrypt('===ll8\'e}x&d:8{F(&gu!Gz~2$$F?"!=#fac3Cagbz;Hbt}yfg|A"9~Fzf(E=:\'A?Ku&"2@9:w^J+2Cs^`)<\'v5Dua&===')).toEqual('an additional encryption example')
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

		try {
			expect(keeper2.decrypt(keeper1.encrypt('example text to encrypt'))).not.toEqual('example text to encrypt')
		} catch {
			// Allowed to throw as a result too.
		}

		try {
			expect(keeper3.decrypt(keeper1.encrypt('example text to encrypt'))).not.toEqual('example text to encrypt')
		} catch {
			// Allowed to throw as a result too.
		}

		try {
			expect(keeper4.decrypt(keeper1.encrypt('example text to encrypt'))).not.toEqual('example text to encrypt')
		} catch {
			// Allowed to throw as a result too.
		}
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