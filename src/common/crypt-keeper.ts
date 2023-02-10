import CryptoJS from 'crypto-js'
import rot47 from 'rot47'
import _ from 'lodash'

/**
 * Reverses a string
 * @param str 
 * @returns 
 */
const reverseString = str => str.split('').reverse().join('')

/**
 * Cryptography helper methods with a hash based off of config delivery ID and hub ID.
 * @param config Codec config with _meta.deliveryId
 * @param hub Hub ID string
 * @returns Encryption methods
 */
const CryptKeeper = (config: any, hub?: string) => {
	const hash = `${reverseString(_.last(config._meta.deliveryId.split('-')))}${hub}${_.last(config._meta.schema.split('/'))}${reverseString(_.first(config._meta.deliveryId.split('-')))}`
	
	/**
	 * Encrypt a string with AES using the generated hash.
	 * @param text 
	 * @returns 
	 */
	const encryptAES = (text: string): string => CryptoJS.AES.encrypt(text, hash).toString()

	/**
	 * Decrypt a string with AES using the generated hash.
	 * @param text 
	 * @returns 
	 */
	const decryptAES = (text: string): string => CryptoJS.AES.decrypt(text, hash).toString(CryptoJS.enc.Utf8)

	/**
	 * Encrypt a string using the generated hash and some additional transforms.
	 * @param text 
	 * @returns 
	 */
	const encrypt = (text: string): string => text.startsWith('===') && text.endsWith('===') ? text : `===${rot47(reverseString(encryptAES(text)))}===`

	/**
	 * Decrypt a string using the generated hash and some additional transforms.
	 * @param text 
	 * @returns 
	 */
	const decrypt = (text: string): string => text.startsWith('===') && text.endsWith('===') ? decryptAES(reverseString(rot47(text.substring(3, text.length - 3)))) : text

	return {
		encrypt,
		decrypt,
		decryptAll: (): any => {
			_.each(config, (value, key) => {
				if (typeof value === 'string') {
					config[key] = decrypt(value)
				}
			})
			return config
		}
	}
}
export { CryptKeeper }