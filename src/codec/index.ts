import { isServer } from '../common/util'
import _, { Dictionary } from 'lodash'
import { API, CommerceAPI, CONSTANTS, findInMegaMenu, flattenCategories } from '..'
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, Identifiable, Product } from '../common/types'
import { IntegrationError } from '../common/errors'

export enum CodecTypes {
    commerce
}

export type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty

export class CodecType {
    _type:          CodecTypes
    _properties:    Dictionary<AnyProperty>
    _vendor:        string

    get type(): CodecTypes {
        return this._type
    }

    get vendor(): string {
        return this._vendor
    }

    get schemaUri(): string {
        return `${CONSTANTS.demostoreIntegrationUri}/${this.vendor}`
    }

    get label(): string {
        return `${this.vendor} integration`
    }

    get iconUrl(): string {
        return `https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/${this.vendor}.png`
    }

    get schema(): any {
        return {
            properties: this.properties
        }
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

export enum CodecTestOperationType {
    megaMenu,
    getCategory,
    getProductById,
    getProductsByKeyword,
    getProductsByProductIds,
    getCustomerGroups
}

export interface CodecTestResult {
    operationType: CodecTestOperationType
    description: string
    arguments: string
    duration: number
    results: any
}

export class CommerceCodec implements CommerceAPI {
    config: CodecPropertyConfig<Dictionary<AnyProperty>>
    megaMenu: Category[] = []
    codecType: CommerceCodecType
    initDuration: number
    
    constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>) {
        this.config = config
    }

    async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
        const startInit = new Date().valueOf()
        await this.cacheMegaMenu()
        this.initDuration = new Date().valueOf() - startInit
        this.codecType = codecType

        if (this.megaMenu.length === 0) {
            throw new IntegrationError({
                message: 'megaMenu has no categories, cannot build navigation',
                helpUrl: ``
            })
        }
        return this
    }

    findCategory(slug: string) {
        return findInMegaMenu(this.megaMenu, slug)
    }    

    async cacheMegaMenu(): Promise<void> {
        this.megaMenu = []
    }

    // defined in terms of getProducts()
    async getProduct(args: GetCommerceObjectArgs): Promise<Product> {
        return _.first(await this.getProducts({ ...args, productIds: args.id }))
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        console.warn(`getProducts is not supported on platform [ ${this.codecType.vendor} ]`)
        return []
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

    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
        console.warn(`getCustomerGroups is not supported on platform [ ${this.codecType.vendor} ]`)
        return []
    }

    async testIntegration(): Promise<CodecTestResult[]> {
        let results: CodecTestResult[] = [{
            operationType: CodecTestOperationType.megaMenu,
            description: 'cache the megamenu',
            arguments: '',
            duration: this.initDuration,
            results: this.megaMenu
        }]

        // 2: get a category by slug, which is done implicitly for all categories here
        let categories: Category[] = await Promise.all(flattenCategories(this.megaMenu).map(async c => {
            let categoryStart = new Date().valueOf()
            let category = await this.getCategory(c)
            results.push({
                operationType: CodecTestOperationType.getCategory,
                description: `get category by slug`,
                arguments: category.slug,
                duration: new Date().valueOf() - categoryStart,
                results: category
            })
            return category
        }))

        let productCategory = categories.find(cat => cat.products.length > 0)

        // 3: get a single product by id
        let singleProductStart = new Date().valueOf()
        let singleProductById = await this.getProduct(getRandom<Product>(productCategory.products))
        results.push({
            operationType: CodecTestOperationType.getProductById,
            description: `get product by id`,
            arguments: singleProductById.id,
            duration: new Date().valueOf() - singleProductStart,
            results: singleProductById
        })

        // 4: search for a product
        let keywordStart = new Date().valueOf()
        let keyword = singleProductById.name.split(' ').pop()
        let searchResults = await this.getProducts({ keyword })
        results.push({
            operationType: CodecTestOperationType.getProductsByKeyword,
            description: `get products by search keyword`,
            arguments: keyword,
            duration: new Date().valueOf() - keywordStart,
            results: searchResults
        })

        // 5: get a list of products given a list of product ids
        let prodsStart = new Date().valueOf()
        let prods = [singleProductById, ..._.take(searchResults, 1)]
        let productIds: string = prods.map(product => product.id).join(',')
        let productsByProductId = await this.getProducts({ productIds })
        results.push({
            operationType: CodecTestOperationType.getProductsByProductIds,
            description: `get products by product ids`,
            arguments: productIds,
            duration: new Date().valueOf() - prodsStart,
            results: productsByProductId
        })

        // 6: get a list of customer groups
        let customerGroupStart = new Date().valueOf()
        let customerGroups = await this.getCustomerGroups({})
        results.push({
            operationType: CodecTestOperationType.getCustomerGroups,
            description: `get customer groups`,
            arguments: '',
            duration: new Date().valueOf() - customerGroupStart,
            results: customerGroups
        })

        return results
    }
}

export const getRandom = <T>(array: T[]): T => array[Math.floor(Math.random() * (array.length - 1))]

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
export const getCodecs = (type?: CodecTypes): CodecType[] => {
    return type ? codecs[type] : _.flatMap(codecs)
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
    let codecs = getCodecs(type)
    let codec: CodecType
    
    // novadev-450: https://ampliencedev.atlassian.net/browse/NOVADEV-450
    if ('vendor' in config) {
        let vendorCodec = codecs.find(codec => codec.vendor === config.vendor)
        if (!vendorCodec) {
            throw new IntegrationError({
                message: `codec not found for vendor [ ${config.vendor} ]`,
                helpUrl: `https://help.dc-demostore.com/codec-error`
            })
        }

        // check that all required properties are there
        let difference = _.difference(Object.keys(vendorCodec.properties), Object.keys(config))
        if (difference.length > 0) {
            throw new IntegrationError({
                message: `configuration missing properties required for vendor [ ${config.vendor} ]: [ ${difference.join(', ')} ]`,
                helpUrl: `https://help.dc-demostore.com/codec-error`
            })
        }

        codec = vendorCodec
    }
    // end novadev-450

    else {
        let codecsMatchingConfig: CodecType[] = codecs.filter(c => _.difference(Object.keys(c.properties), Object.keys(config)).length === 0)
        if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
            throw new IntegrationError({
                message: `[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(maskSensitiveData(config), undefined, 4)}`,
                helpUrl: `https://help.dc-demostore.com/codec-error`
            })
        }
        codec = codecsMatchingConfig.pop()
    }

    let configHash = _.values(config).join('')
    console.log(`[ demostore ] creating codec: ${codec.vendor}...`)
    return apis[configHash] = apis[configHash] || await codec.getApi(config)
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

import AkeneoCodecType from './codecs/akeneo'
registerCodec(new AkeneoCodecType())

import BigCommerceCommerceCodecType from './codecs/bigcommerce'
registerCodec(new BigCommerceCommerceCodecType())

import CommerceToolsCodecType from './codecs/commercetools'
registerCodec(new CommerceToolsCodecType())

import ConstructorIOCodecType from './codecs/constructor.io'
registerCodec(new ConstructorIOCodecType())

import ElasticPathCommerceCodecType from './codecs/elasticpath'
registerCodec(new ElasticPathCommerceCodecType())

import FabricCodecType from './codecs/fabric'
registerCodec(new FabricCodecType())

import HybrisCodecType from './codecs/hybris'
registerCodec(new HybrisCodecType())

import RestCodecType from './codecs/rest'
registerCodec(new RestCodecType())

import SFCCCodecType from './codecs/sfcc'
registerCodec(new SFCCCodecType())

// reexport codec common functions
export * from './codecs/common'