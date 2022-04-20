import CryptoJS from 'crypto-js'
import rot47 from 'rot47'
import _ from 'lodash'

const reverseString = str => str.split("").reverse().join("")
const CryptKeeper = (config: any, hub?: string) => {
    const hash = `${reverseString(_.last(config._meta.deliveryId.split('-')))}${hub}${_.last(config._meta.schema.split('/'))}${reverseString(_.first(config._meta.deliveryId.split('-')))}`
    const encryptAES = (text: string): string => CryptoJS.AES.encrypt(text, hash).toString()
    const decryptAES = (text: string): string => {
        const bytes = CryptoJS.AES.decrypt(text, hash);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    const encrypt = (text: string): string => text.startsWith('===') && text.endsWith('===') ? text : `===${rot47(reverseString(encryptAES(text)))}===`
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
export default CryptKeeper