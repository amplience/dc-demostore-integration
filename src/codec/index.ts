import _, { Dictionary } from 'lodash'
import { API, CommerceAPI, CommonArgs } from '..'

export type CodecConfiguration = {
    _meta?: {
        deliveryKey?: string
        deliveryId: string
        schema: string
    }
    locator?: string
}

export type Property = {
    title:          string
}

export type StringProperty = Property & {
    type:       'string'
    minLength?: number
    maxLength?: number
    pattern?:   string
}

export type NumberProperty = Property & {
    type:               'number'
    multipleOf?:        number
    minimum?:           number
    maximum?:           number
    exclusiveMinimum?:  number
    exclusiveMaximum?:  number
}

export type IntegerProperty = NumberProperty & {
    type:           'integer'
}

export type ArrayProperty = Property & {
    type:           'array'
    items?:         number
    minItems?:      number
    maxItems?:      number
    required?:      boolean
    uniqueItems?:   boolean
}

export type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty

export interface Codec {
    schema: {
        uri:        string
        properties: Dictionary<AnyProperty>
        icon:       string
    }
    getAPI(config: any): any
}

export interface CommerceCodec extends Codec {
    getAPI(config: any): CommerceAPI
}

export type CodecStringConfig<T> = {
    [Key in keyof T]: string
}

const codecs: Codec[] = []
export const getCodecs = (): Codec[] => {
    return codecs
}

export const registerCodec = (codec: Codec) => {
    // console.log(`[ demostore ] register codec ${codec.SchemaURI}`)
    if (!codecs.includes(codec)) {
        codecs.push(codec)
    }
}

export const getCodec = (config: CodecConfiguration): API => {
    let codec: Codec = codecs.find(c => !!c.getAPI(config))
    if (!codec) {
        throw `[ demostore ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }

    let api = codec.getAPI(config)
    _.each(api, (method: any, key: string) => {
        if (typeof api[key] === 'function') {
            // apply default arguments for those not provided in the query
            api[key] = async (args: CommonArgs): Promise<any> => await method({
                locale: 'en-US',
                language: 'en',
                country: 'US',
                currency: 'USD',
                segment: '',
                ...args
            })
        }
    })
    return api
}

registerCodec(require('./codecs/bigcommerce').default)
registerCodec(require('./codecs/commercetools').default)
registerCodec(require('./codecs/sfcc').default)
registerCodec(require('./codecs/elasticpath').default)
registerCodec(require('./codecs/rest').default)
registerCodec(require('./codecs/fabric').default)
registerCodec(require('./codecs/hybris').default)