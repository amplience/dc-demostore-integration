import { isServer } from '../common/util'
import _, { Dictionary } from 'lodash'
import { API, CommerceAPI } from '..'
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, Identifiable, Product } from '../common/types'
import { findInMegaMenu } from './codecs/common'

export type Property = {
    title: string
}

export type StringProperty = Property & {
    type: 'string'
    minLength?: number
    maxLength?: number
    pattern?: string
}

export type StringConstProperty = StringProperty & {
    const: string
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
    type:   'integer'
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
    metadata: {
        type:       CodecType
        properties: Dictionary<AnyProperty>
        vendor:     string
    }
    getAPI(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<T>
}

export type GenericCodec = Codec<API>
export type CommerceCodec = Codec<CommerceAPI>

export type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string 
                    : T[K] extends StringConstProperty ? string 
                    : T[K] extends NumberProperty ? number 
                    : T[K] extends IntegerProperty ? number 
                    : any[]
}

const codecs = new Map<CodecType, GenericCodec[]>()
codecs[CodecType.commerce] = []

// public interface
export const getCodecs = (type: CodecType): GenericCodec[] => {
    return codecs[type]
}

export const registerCodec = (codec: GenericCodec) => {
    if (!codecs[codec.metadata.type].includes(codec)) {
        codecs[codec.metadata.type].push(codec)
    }
}

// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map<any, API>()

export const getCodec = async (config: any, type: CodecType): Promise<API> => {
    let codecsMatchingConfig: GenericCodec[] = getCodecs(type).filter(c => _.difference(Object.keys(c.metadata.properties), Object.keys(config)).length === 0)

    if (codecsMatchingConfig.length === 0) {
        throw `[ demostore ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }
    else if (codecsMatchingConfig.length > 1) {
        throw `[ demostore ] multiple codecs found matching schema [ ${JSON.stringify(config)} ]`
    }

    let configHash = _.values(config).join('')
    if (!apis[configHash]) {
        let codec = _.first(codecsMatchingConfig)
        console.log(`[ demostore ] creating codec: ${codec.metadata.vendor}...`)
        let api = await codec.getAPI(config)
        apis[configHash] = wrappedCommerceApi(api as CommerceAPI)
    }
    return apis[configHash]
}

const defaultArgs = (args: CommonArgs): CommonArgs => ({
    locale:     'en-US',
    language:   'en',
    country:    'US',
    currency:   'USD',
    segment:    '',
    ...args
})

const wrappedCommerceApi = async (api: CommerceAPI): Promise<CommerceAPI> => {
    // cache the mega menu
    let megaMenu: Category[] = await api.getMegaMenu(defaultArgs({}))

    let wrapped: CommerceAPI = {
        getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
            return await api.getProduct(defaultArgs(args))
        },
        getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
            return await api.getProducts(defaultArgs(args))
        },
        getCategory: async (args: GetCommerceObjectArgs): Promise<Category> => {
            let category = findInMegaMenu(megaMenu, args.slug) || await api.getCategory(defaultArgs(args))
            if (category) {
                category.products = await api.getProducts({ category })
            }
            return category
        },
        getMegaMenu: async (args: CommonArgs): Promise<Category[]> => {
            return megaMenu
        },
        getCustomerGroups: async (args: CommonArgs): Promise<Identifiable[]> => {
            return await api.getCustomerGroups(defaultArgs(args))
        }
    }

    return wrapped
}

export const getCommerceCodec = async (config: any): Promise<CommerceAPI> => await getCodec(config, CodecType.commerce) as CommerceAPI
// end public interface

// register codecs
if (isServer()) {
    import('./codecs/akeneo')
    import('./codecs/bigcommerce')
    import('./codecs/commercetools')
    import('./codecs/constructor.io')
    import('./codecs/elasticpath')
    import('./codecs/fabric')
    import('./codecs/hybris')
    import('./codecs/rest')
    import('./codecs/sfcc')
}

// reexport codec common functions
export * from './codecs/common'