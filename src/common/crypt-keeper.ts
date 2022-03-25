import CryptoJS from 'crypto-js'
import rot47 from 'rot47'
import { CodecConfiguration } from '..'
import _ from 'lodash'

const reverseString = str => str.split("").reverse().join("")
const CryptKeeper = (config: CodecConfiguration) => {
    const hash = `${reverseString(_.last(config._meta.deliveryId.split('-')))}${_.first(config.locator.split(':'))}${_.last(config._meta.schema.split('/'))}${reverseString(_.first(config._meta.deliveryId.split('-')))}`
    const encryptAES = (text: string): string => CryptoJS.AES.encrypt(text, hash).toString();
    const decryptAES = (text: string): string => {
        const bytes = CryptoJS.AES.decrypt(text, hash);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    return {
        encrypt: (text: string): string => {
            return text.startsWith('===') && text.endsWith('===') ? text : `===${rot47(reverseString(encryptAES(text)))}===`
        },
        decrypt: (text: string): string => {
            return text.startsWith('===') && text.endsWith('===') ? decryptAES(reverseString(rot47(text.substring(3, text.length - 3)))) : text
        }
    }
}
export default CryptKeeper