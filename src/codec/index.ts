import { isServer } from '../common/util'
import _, { Dictionary } from 'lodash'
import { API, CommerceAPI } from '..'
import { SFCCProduct } from './codecs/sfcc/types'
import { Category, CommonArgs, GetCommerceObjectArgs, GetProductsArgs, GetProductVariantsArgs, Identifiable, Product } from '../common/types'
import { CodecNotFoundError } from '../common/errors'

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
    getAPI(config: CodecPropertyConfig<Dictionary<AnyProperty>>): Promise<Partial<T>>
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
	const codecsMatchingConfig: GenericCodec[] = getCodecs(type).filter(c => _.difference(Object.keys(c.metadata.properties), Object.keys(config)).length === 0)

	if (codecsMatchingConfig.length === 0 || codecsMatchingConfig.length > 1) {
		throw new CodecNotFoundError(`[ ${codecsMatchingConfig.length} ] codecs found (expecting 1) matching schema:\n${JSON.stringify(config, undefined, 4)}`)
	}

	const configHash = _.values(config).join('')
	if (!apis[configHash]) {
		const codec = _.first(codecsMatchingConfig)
		console.log(`[ demostore ] creating codec: ${codec.metadata.vendor}...`)
		const api = await codec.getAPI(config)
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

const wrappedCommerceApi = async (api: Partial<CommerceAPI>): Promise<Partial<CommerceAPI>> => {
	// cache the mega menu
	const megaMenu: Category[] = await api.getMegaMenu(defaultArgs({}))

	const flattenedCategories: Category[] = []
	const bulldozeCategories = cat => {
		flattenedCategories.push(cat)
		cat.children && cat.children.forEach(bulldozeCategories)
	}
	megaMenu.forEach(bulldozeCategories)

	const findCategory = (slug: string) => {
		return flattenedCategories.find(category => category.slug?.toLowerCase() === slug?.toLowerCase())
	}
    
	const wrapped: CommerceAPI = {
		getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => {
			// current thinking: point to wrapped.getProducts() as getProduct() is really a subset of getProducts()
			return _.first(await wrapped.getProducts({ ...args, productIds: args.id }))
		},
		getVariants: async (args: GetProductVariantsArgs): Promise<SFCCProduct> => {
			return await api.getVariants(args)
		},
		getProducts: async (args: GetProductsArgs): Promise<Product[]> => {
			return await api.getProducts(defaultArgs(args))
		},
		getCategory: async (args: GetCommerceObjectArgs): Promise<Category> => {
			const category = findCategory(args.slug)
			if (category) {
				// populate products into category
				category.products = category.products?.length > 0 ? category.products : await wrapped.getProducts({ category })
			}
			return category
		},
		getMegaMenu: async (args: CommonArgs): Promise<Category[]> => {
			return megaMenu
		},
		getCustomerGroups: async (args: CommonArgs): Promise<Identifiable[]> => {
			// pass through
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