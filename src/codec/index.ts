import { isServer } from '../common/util'
import _, { Dictionary } from 'lodash'
import { API, CommerceAPI } from '..'
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, Identifiable, Product } from '../common/types'
import { IntegrationError } from '../common/errors'
import { Exception } from '../common/api'

export enum CodecTypes {
    commerce
}

export type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty

export class CodecType {
    _type:       CodecTypes
    _properties: Dictionary<AnyProperty>
    _vendor:     string

    get type(): CodecTypes {
        return this._type
    }

    get vendor(): string {
        return this._vendor
    }

    get properties(): Dictionary<AnyProperty> {
        return this._properties
    }

    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<API> {
        throw new Error('must implement getCodec')
    }
}

export class CommerceCodecType extends CodecType {
    get type() {
        return CodecTypes.commerce
    }

    getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<CommerceAPI> {
        throw new Error('must implement getCodec')
    }
}

export class CommerceCodec implements CommerceAPI {
    config: CodecPropertyConfig<Dictionary<AnyProperty>>
    megaMenu: Category[] = []
 
    constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>) {
        this.config = config
    }

    async init(): Promise<CommerceCodec> {
        await this.cacheMegaMenu()
        if (this.megaMenu.length === 0) {
            console.warn(`megaMenu has no categories, check setup`)
        }
        return this
    }

    findCategory(slug: string) {
        let flattenedCategories: Category[] = []
        const bulldozeCategories = cat => {
            flattenedCategories.push(cat)
            cat.children && cat.children.forEach(bulldozeCategories)
        }
        this.megaMenu.forEach(bulldozeCategories)
        return flattenedCategories.find(category => category.slug?.toLowerCase() === slug?.toLowerCase())
    }    

    async cacheMegaMenu(): Promise<void> {
        this.megaMenu = []
    }

    // defined in terms of getProducts()
    async getProduct(args: GetCommerceObjectArgs): Promise<Product> {
        return _.first(await this.getProducts({ ...args, productIds: args.id }))
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        throw new Error('must implement getProducts')
    }

    // defined in terms of getMegaMenu, effectively
    async getCategory(args: GetCommerceObjectArgs): Promise<Category> {
        let category = this.findCategory(args.slug)
        category.products = await this.getProducts({ ...args, category })
        return category
    }

    async getMegaMenu(args: CommonArgs): Promise<Category[]> {
        return this.megaMenu
    }

    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[] | Exception> {
        return { exception: `unsupported platform` }
    }
}


export type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string 
                    : T[K] extends StringConstProperty ? string 
                    : T[K] extends NumberProperty ? number 
                    : T[K] extends IntegerProperty ? number 
                    : any[]
}

const codecs = new Map<CodecTypes, CodecType[]>()
codecs[CodecTypes.commerce] = []

// public interface
export const getCodecs = (type: CodecTypes): CodecType[] => {
    return codecs[type]
}

export const registerCodec = (codec: CodecType) => {
    if (!codecs[codec.type].includes(codec)) {
        codecs[codec.type].push(codec)
    }
}

// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map<any, API>()

import { StringProperty, NumberProperty, IntegerProperty, ArrayProperty, StringConstProperty } from './cms-property-types'

const maskSensitiveData = (obj: any) => {
    return {
        ...obj,
        client_secret: obj.client_secret && `**** redacted ****`,
        api_token: obj.api_token && `**** redacted ****`,
        password: obj.password && `**** redacted ****`,
    }
}

export const getCodec = async (config: any, type: CodecTypes): Promise<API> => {
    let codecsMatchingConfig: CodecType[] = getCodecs(type).filter(c => _.difference(Object.keys(c.properties), Object.keys(config)).length === 0)
    if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
        throw new IntegrationError({
            message: `[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(maskSensitiveData(config), undefined, 4)}`,
            helpUrl: `https://help.dc-demostore.com/codec-error`
        })
    }

    let configHash = _.values(config).join('')
    if (!apis[configHash]) {
        let CType = _.first(codecsMatchingConfig)
        console.log(`[ demostore ] creating codec: ${CType.vendor}...`)
        let api = await CType.getApi(config)
        apis[configHash] = api

        // apis[configHash] = _.zipObject(Object.keys(api), Object.keys(api).filter(key => typeof api[key] === 'function').map((key: string) => {
        //     // apply default arguments for those not provided in the query
        //     return async (args: CommonArgs): Promise<any> => await api[key]({
        //         ...defaultArgs,
        //         ...args
        //     })
        // }))
    }

    return apis[configHash]
}

export const defaultArgs: CommonArgs = {
    locale:     'en-US',
    language:   'en',
    country:    'US',
    currency:   'USD',
    segment:    ''
}

export const getCommerceCodec = async (config: any): Promise<CommerceAPI> => await getCodec(config, CodecTypes.commerce) as CommerceAPI
// end public interface

// register codecs
if (isServer()) {
    import('./codecs/rest')
    import('./codecs/commercetools')
    import('./codecs/bigcommerce')
    import('./codecs/akeneo')
    import('./codecs/fabric')
    import('./codecs/constructor.io')
    import('./codecs/elasticpath')
    import('./codecs/hybris')
    import('./codecs/sfcc')
}

// reexport codec common functions
export * from './codecs/common'