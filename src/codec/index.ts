import _, { Dictionary } from 'lodash'
import { API, CommerceAPI, CommonArgs } from '..'

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

export enum CodecType {
    commerce
}

export type Codec<T> = {
    schema: {
        type:       CodecType
        uri:        string
        properties: Dictionary<AnyProperty>
        icon:       string
    }
    getAPI(config: any): Promise<T>
}

export type GenericCodec = Codec<API>
export type CommerceCodec = Codec<CommerceAPI>

export type CodecStringConfig<T> = {
    [Key in keyof T]: string
}

const codecs = new Map<CodecType, Codec<any>>()
codecs[CodecType.commerce] = []

export const getCodecs = (type: CodecType): Codec<any>[] => {
    return codecs[type]
}

export const registerCodec = (codec: Codec<any>) => {
    // console.log(`[ demostore ] register [ ${codec.schema.type} ] codec ${codec.schema.uri}`)
    if (!codecs[codec.schema.type].includes(codec)) {
        codecs[codec.schema.type].push(codec)
    }
}

// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map<any, API>()

export const getCodec = async (config: any, type: CodecType): Promise<API> => {
    let codecsMatchingConfig: Codec<any>[] = getCodecs(type).filter(c => _.difference(Object.keys(c.schema.properties), Object.keys(config)).length === 0)

    if (codecsMatchingConfig.length === 0) {
        throw `[ demostore ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }
    else if (codecsMatchingConfig.length > 1) {
        throw `[ demostore ] multiple codecs found matching schema [ ${JSON.stringify(config)} ]`
    }

    if (!apis[config]) {
        let codec = _.first(codecsMatchingConfig)
        let api = await codec.getAPI(config)
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
        apis[config] = api
    }
    return apis[config]
}

export const getCommerceCodec = async (config: any): Promise<CommerceAPI> => {
    return await getCodec(config, CodecType.commerce) as CommerceAPI
}

registerCodec(require('./codecs/bigcommerce').default)
registerCodec(require('./codecs/commercetools').default)
registerCodec(require('./codecs/sfcc').default)
registerCodec(require('./codecs/elasticpath').default)
registerCodec(require('./codecs/rest').default)
registerCodec(require('./codecs/fabric').default)
registerCodec(require('./codecs/hybris').default)