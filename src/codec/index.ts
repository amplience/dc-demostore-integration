import { isServer } from '../common/util'
import _, { Dictionary } from 'lodash'
import { API, CommerceAPI, CommonArgs } from '..'

export type Property = {
    title: string
}

export type StringProperty = Property & {
    type: 'string'
    minLength?: number
    maxLength?: number
    pattern?: string
}

export type NumberProperty = Property & {
    type: 'number'
    multipleOf?: number
    minimum?: number
    maximum?: number
    exclusiveMinimum?: number
    exclusiveMaximum?: number
}

export type IntegerProperty = NumberProperty & {
    type: 'integer'
}

export type ArrayProperty = Property & {
    type: 'array'
    items?: number
    minItems?: number
    maxItems?: number
    required?: boolean
    uniqueItems?: boolean
}

export enum CodecType {
    commerce
}

export type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty
export type Codec<T> = {
    schema: {
        type: CodecType
        uri: string
        properties: Dictionary<AnyProperty>
        icon: string
    }
    getAPI(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<T>
}

export type GenericCodec = Codec<API>
export type CommerceCodec = Codec<CommerceAPI>

export type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string : T[K] extends NumberProperty ? number : T[K] extends IntegerProperty ? number : any[]
}

const codecs = new Map<CodecType, GenericCodec>()
codecs[CodecType.commerce] = []

// public interface
export const getCodecs = (type: CodecType): GenericCodec[] => {
    return codecs[type]
}

export const registerCodec = (codec: GenericCodec) => {
    if (!codecs[codec.schema.type].includes(codec)) {
        codecs[codec.schema.type].push(codec)
    }
}

// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map<any, API>()

export const getCodec = async (config: any, type: CodecType): Promise<API> => {
    let codecsMatchingConfig: GenericCodec[] = getCodecs(type).filter(c => _.difference(Object.keys(c.schema.properties), Object.keys(config)).length === 0)

    if (codecsMatchingConfig.length === 0) {
        throw `[ demostore ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }
    else if (codecsMatchingConfig.length > 1) {
        throw `[ demostore ] multiple codecs found matching schema [ ${JSON.stringify(config)} ]`
    }

    if (!apis[config]) {
        let api = await _.first(codecsMatchingConfig).getAPI(config)
        apis[config] = _.zipObject(Object.keys(api), Object.keys(api).filter(key => typeof api[key] === 'function').map((key: string) => {
            // apply default arguments for those not provided in the query
            return async (args: CommonArgs): Promise<any> => await api[key]({
                locale:     'en-US',
                language:   'en',
                country:    'US',
                currency:   'USD',
                segment:    '',
                ...args
            })
        }))
    }
    return apis[config]
}

export const getCommerceCodec = async (config: any): Promise<CommerceAPI> => await getCodec(config, CodecType.commerce) as CommerceAPI
// end public interface

// register codecs
if (isServer()) {
    import('./codecs/bigcommerce')
    import('./codecs/commercetools')
    import('./codecs/elasticpath')
    import('./codecs/fabric')
    import('./codecs/hybris')
    import('./codecs/rest')
    import('./codecs/sfcc')
}

// reexport codec common functions
export * from './codecs/common'