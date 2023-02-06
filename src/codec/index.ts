import _, { Dictionary } from 'lodash'
import { 
	API, 
	CommerceAPI, 
	CONSTANTS, 
	findInMegaMenu, 
	flattenCategories 
} from '..'
import { 
	Category, 
	CommonArgs, 
	GetCommerceObjectArgs, 
	GetProductsArgs, 
	GetVariantsArgs,
	Identifiable, 
	Product 
} from '../common/types'
import { IntegrationError } from '../common/errors'

/**
 * TODO
 */
export enum CodecTypes {
    commerce
}

/**
 * TODO
 */
export type AnyProperty = StringProperty | NumberProperty | IntegerProperty | ArrayProperty

/**
 * TODO
 */
export class CodecType {
	_type:          CodecTypes
	_properties:    Dictionary<AnyProperty>
	_vendor:        string

	/**
	 * TODO
	 */
	get type(): CodecTypes {
		return this._type
	}

	/**
	 * TODO
	 */
	get vendor(): string {
		return this._vendor
	}

	/**
	 * TODO
	 */
	get schemaUri(): string {
		return `${CONSTANTS.demostoreIntegrationUri}/${this.vendor}`
	}

	/**
	 * TODO
	 */
	get label(): string {
		return `${this.vendor} integration`
	}

	/**
	 * TODO
	 */
	get iconUrl(): string {
		return `https://demostore-catalog.s3.us-east-2.amazonaws.com/assets/${this.vendor}.png`
	}

	/**
	 * TODO
	 */
	get schema(): any {
		return {
			properties: this.properties
		}
	}

	/**
	 * TODO
	 */
	get properties(): Dictionary<AnyProperty> {
		return this._properties
	}

	/**
	 * TODO
	 * @param config 
	 */
	getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<API> {
		throw new Error('must implement getCodec')
	}

	/**
	 * TODO
	 * @param config 
	 * @returns 
	 */
	// novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
	async postProcess(config: any): Promise<any> {
		return config
	}
}

/**
 * TODO
 */
export class CommerceCodecType extends CodecType {
	
	/**
	 * TODO
	 */
	get type() {
		return CodecTypes.commerce
	}

	/**
	 * TODO
	 * @param config 
	 */
	getApi(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<CommerceAPI> {
		throw new Error('must implement getCodec')
	}
}

/**
 * TODO
 */
export enum CodecTestOperationType {
    megaMenu,
    getCategory,
    getProductById,
    getProductsByKeyword,
    getProductsByProductIds,
    getCustomerGroups
}

/**
 * TODO
 */
export interface CodecTestResult {
    operationType: CodecTestOperationType
    description: string
    arguments: string
    duration: number
    results: any
}

/**
 * TODO
 */
export class CommerceCodec implements CommerceAPI {
	config: CodecPropertyConfig<Dictionary<AnyProperty>>
	megaMenu: Category[] = []
	codecType: CommerceCodecType
	initDuration: number
    
	/**
	 * TODO
	 * @param config 
	 */
	constructor(config: CodecPropertyConfig<Dictionary<AnyProperty>>) {
		this.config = config
	}

	/**
	 * TODO
	 * @param codecType 
	 * @returns 
	 */
	async init(codecType: CommerceCodecType): Promise<CommerceCodec> {
		const startInit = new Date().valueOf()
		await this.cacheMegaMenu()
		this.initDuration = new Date().valueOf() - startInit
		this.codecType = codecType

		if (this.megaMenu.length === 0) {
			throw new IntegrationError({
				message: 'megaMenu has no categories, cannot build navigation',
				helpUrl: ''
			})
		}
		return this
	}

	/**
	 * TODO
	 * @param slug 
	 * @returns 
	 */
	findCategory(slug: string) {
		return findInMegaMenu(this.megaMenu, slug)
	}    

	/**
	 * TODO
	 */
	async cacheMegaMenu(): Promise<void> {
		this.megaMenu = []
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	// defined in terms of getProducts()
	async getProduct(args: GetCommerceObjectArgs): Promise<Product> {
		return _.first(await this.getProducts({ ...args, productIds: args.id }))
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getProducts(args: GetProductsArgs): Promise<Product[]> {
		console.warn(`getProducts is not supported on platform [ ${this.codecType.vendor} ]`)
		return []
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	// defined in terms of getMegaMenu, effectively
	async getCategory(args: GetCommerceObjectArgs): Promise<Category> {
		const category = this.findCategory(args.slug)
		category.products = await this.getProducts({ ...args, category })
		return category
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getMegaMenu(args: CommonArgs): Promise<Category[]> {
		return this.megaMenu
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
		console.warn(`getCustomerGroups is not supported on platform [ ${this.codecType.vendor} ]`)
		return []
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getVariants(args: GetVariantsArgs): Promise<SFCCProduct> {
		return await this.getVariants(args)
	}

	/**
	 * TODO
	 * @param args 
	 * @returns 
	 */
	async getRawProducts(args: GetProductsArgs): Promise<SFCCProduct[]> {
		console.warn(`getRawProducts is not supported on platform [ ${this.codecType.vendor} ]`)
		return []
	}

	/**
	 * TODO
	 * @returns 
	 */
	async testIntegration(): Promise<CodecTestResult[]> {
		const results: CodecTestResult[] = [{
			operationType: CodecTestOperationType.megaMenu,
			description: 'cache the megamenu',
			arguments: '',
			duration: this.initDuration,
			results: this.megaMenu
		}]

		// 2: get a category by slug, which is done implicitly for all categories here
		const categories: Category[] = await Promise.all(flattenCategories(this.megaMenu).map(async c => {
			const categoryStart = new Date().valueOf()
			const category = await this.getCategory(c)
			results.push({
				operationType: CodecTestOperationType.getCategory,
				description: 'get category by slug',
				arguments: category.slug,
				duration: new Date().valueOf() - categoryStart,
				results: category
			})
			return category
		}))

		const productCategory = categories.find(cat => cat.products.length > 0)

		// 3: get a single product by id
		const singleProductStart = new Date().valueOf()
		const singleProductById = await this.getProduct(getRandom<Product>(productCategory.products))
		results.push({
			operationType: CodecTestOperationType.getProductById,
			description: 'get product by id',
			arguments: singleProductById.id,
			duration: new Date().valueOf() - singleProductStart,
			results: singleProductById
		})

		// 4: search for a product
		const keywordStart = new Date().valueOf()
		const keyword = singleProductById.name.split(' ').pop()
		const searchResults = await this.getProducts({ keyword })
		results.push({
			operationType: CodecTestOperationType.getProductsByKeyword,
			description: 'get products by search keyword',
			arguments: keyword,
			duration: new Date().valueOf() - keywordStart,
			results: searchResults
		})

		// 5: get a list of products given a list of product ids
		const prodsStart = new Date().valueOf()
		const prods = [singleProductById, ..._.take(searchResults, 1)]
		const productIds: string = prods.map(product => product.id).join(',')
		const productsByProductId = await this.getProducts({ productIds })
		results.push({
			operationType: CodecTestOperationType.getProductsByProductIds,
			description: 'get products by product ids',
			arguments: productIds,
			duration: new Date().valueOf() - prodsStart,
			results: productsByProductId
		})

		// 6: get a list of customer groups
		const customerGroupStart = new Date().valueOf()
		const customerGroups = await this.getCustomerGroups({})
		results.push({
			operationType: CodecTestOperationType.getCustomerGroups,
			description: 'get customer groups',
			arguments: '',
			duration: new Date().valueOf() - customerGroupStart,
			results: customerGroups
		})

		return results
	}
}

/**
 * TODO
 * @param array 
 * @returns 
 */
export const getRandom = <T>(array: T[]): T => array[Math.floor(Math.random() * (array.length - 1))]

/**
 * TODO
 */
export type CodecPropertyConfig<T extends Dictionary<AnyProperty>> = {
    [K in keyof T]: T[K] extends StringProperty ? string 
                    : T[K] extends StringConstProperty ? string 
                    : T[K] extends NumberProperty ? number 
                    : T[K] extends IntegerProperty ? number 
                    : any[]
}

const codecs = new Map<CodecTypes, CodecType[]>()
codecs[CodecTypes.commerce] = []

/**
 * TODO
 * @param type 
 * @returns 
 */
// public interface
export const getCodecs = (type?: CodecTypes): CodecType[] => {
	return type ? codecs[type] : _.flatMap(codecs)
}

/**
 * TODO
 * @param codec 
 */
export const registerCodec = (codec: CodecType) => {
	if (!codecs[codec.type].includes(codec)) {
		codecs[codec.type].push(codec)
	}
}

// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map<any, API>()

import { StringProperty, NumberProperty, IntegerProperty, ArrayProperty, StringConstProperty } from './cms-property-types'

/**
 * TODO
 * @param obj 
 * @returns 
 */
const maskSensitiveData = (obj: any) => {
	return {
		...obj,
		client_secret: obj.client_secret && '**** redacted ****',
		api_token: obj.api_token && '**** redacted ****',
		password: obj.password && '**** redacted ****',
	}
}

/**
 * TODO
 * @param config 
 * @param type 
 * @returns 
 */
export const getCodec = async (config: any, type: CodecTypes): Promise<API> => {
	const codecs = getCodecs(type)
	let codec: CodecType
    
	// novadev-450: https://ampliencedev.atlassian.net/browse/NOVADEV-450
	if ('vendor' in config) {
		const vendorCodec = codecs.find(codec => codec.vendor === config.vendor)
		if (!vendorCodec) {
			throw new IntegrationError({
				message: `codec not found for vendor [ ${config.vendor} ]`,
				helpUrl: 'https://help.dc-demostore.com/codec-error'
			})
		}

		// check that all required properties are there
		const difference = _.difference(Object.keys(vendorCodec.properties), Object.keys(config))
		if (difference.length > 0) {
			throw new IntegrationError({
				message: `configuration missing properties required for vendor [ ${config.vendor} ]: [ ${difference.join(', ')} ]`,
				helpUrl: 'https://help.dc-demostore.com/codec-error'
			})
		}

		codec = vendorCodec
	}
	// end novadev-450

	else {
		const codecsMatchingConfig: CodecType[] = codecs.filter(c => _.difference(Object.keys(c.properties), Object.keys(config)).length === 0)
		if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
			throw new IntegrationError({
				message: `[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(maskSensitiveData(config), undefined, 4)}`,
				helpUrl: 'https://help.dc-demostore.com/codec-error'
			})
		}
		codec = codecsMatchingConfig.pop()
	}

	const configHash = _.values(config).join('')
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

/**
 * TODO
 * @param config 
 * @returns 
 */
export const getCommerceCodec = async (config: any): Promise<CommerceAPI> => await getCodec(config, CodecTypes.commerce) as CommerceAPI
// end public interface

import CommerceToolsCodecType from './codecs/commercetools'
registerCodec(new CommerceToolsCodecType())

import RestCodecType from './codecs/rest'
registerCodec(new RestCodecType())

import SFCCCodecType from './codecs/sfcc'
import { SFCCProduct } from './codecs/sfcc/types'
registerCodec(new SFCCCodecType())

// reexport codec common functions
export * from './codecs/common'