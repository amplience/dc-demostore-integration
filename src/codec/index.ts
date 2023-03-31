import _ from 'lodash'
import { CodecTypes, CodecType } from './codecs/core'
import { IntegrationError } from '../common/errors'
import { API, CommerceAPI } from '../common'

const codecs = new Map<CodecTypes, CodecType[]>()
codecs[CodecTypes.commerce] = []

/**
 * Get all the codecs with a given type
 * @param type Codec type
 * @returns All registered codecs that match the type
 */
// public interface
export const getCodecs = (type?: CodecTypes): CodecType[] => {
	return type ? codecs[type] : _.flatMap(codecs)
}

/**
 * Register a codec type object.
 * @param codec Codec type object
 */
export const registerCodec = (codec: CodecType) => {
	if (!codecs[codec.type].includes(codec)) {
		codecs[codec.type].push(codec)
	}
}

// create a cache of apis so we can init them once only, assuming some initial load time (catalog etc)
const apis = new Map<any, API>()

/**
 * Mask sensitive data in an object.
 * Note: only affects fields called `client_secret`, `api_token`, `password`.
 * @param obj Object to copy with sensitive fields removed.
 * @returns The object with any sensitive fields removed.
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
 * Get an API given a configuration object and a codec type.
 * It attempts to match a registered codec by the `vendor` property first, if present.
 * If not, it attempts to match based on the shape of the codec object.
 * @param config API configuration
 * @param type Type of codec to find
 * @returns A new API for the given configuration.
 */
export const getCodec = async (config: any, type: CodecTypes): Promise<API> => {
	const codecs = getCodecs(type)
	let codec: CodecType
    
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

/**
 * Get a commerce API given a configuration object.
 * It attempts to match a registered codec by the `vendor` property first, if present.
 * If not, it attempts to match based on the shape of the codec object.
 * @param config Configuration object for the commerce API
 * @returns A new commerce API for the given configuration
 */
export const getCommerceCodec = async (config: any): Promise<CommerceAPI> => await getCodec(config, CodecTypes.commerce) as CommerceAPI
// end public interface

import CommerceToolsCodecType from './codecs/commerce/commercetools'
registerCodec(new CommerceToolsCodecType())

import RestCodecType from './codecs/commerce/rest'
registerCodec(new RestCodecType())

import SFCCCodecType from './codecs/commerce/sfcc'
registerCodec(new SFCCCodecType())

import BigCommerceCommerceCodecType from './codecs/commerce/bigcommerce'
registerCodec(new BigCommerceCommerceCodecType())

import ShopifyCommerceCodecType from './codecs/commerce/shopify'
registerCodec(new ShopifyCommerceCodecType())

// reexport codec common functions
export * from './codecs/common'
export * from './codecs/core'