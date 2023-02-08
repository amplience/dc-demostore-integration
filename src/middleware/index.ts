import { getContentItem, getContentItemFromConfigLocator } from '../amplience'
import axios from 'axios'
import { CommerceAPI, CONSTANTS, getCodecs, getCommerceCodec } from '../index'
import { isServer } from '../common/util'

/**
 * TODO
 * @param config
 * @returns
 */
const getAPI = async (config: any): Promise<CommerceAPI> => {
	// we are passed in an object here
	//   - if it does not the key 'config_locator', it is assumed to be the config block for a codec
	//   - else retrieve the object
	//     - if the schema of the object is NOT the demostoreconfig, it is assumed to be the config block
	//     - else retrieve the object with id <demostoreconfig.commerce.id>

	if ('config_locator' in config) {
		const [hub, _] = config.config_locator.split(':')
		config = await getContentItemFromConfigLocator(config.config_locator)
		if (config._meta.schema === CONSTANTS.demostoreConfigUri) {
			config = await getContentItem(hub, config.commerce)
		}
	}

	// novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
	const matchingCodec = getCodecs().find(
		(c) => c.vendor === config.vendor || c.schemaUri === config._meta?.schema
	)
	if (matchingCodec) {
		config = await matchingCodec.postProcess(config)
	}
	// end novadev-582

	return await getCommerceCodec(config)
}

/**
 * TODO
 */
export type CommerceOperation =
	| 'getProduct'
	| 'getProducts'
	| 'getCategory'
	| 'getMegaMenu'
	| 'getCustomerGroups'
	| 'getVariants'
	| 'getRawProducts'

/**
 * TODO
 * @param params
 * @returns
 */
// getCommerceAPI is the main client interaction point with the integration layer
export const getCommerceAPI = async (params: any = undefined): Promise<CommerceAPI> => {
	let codec = params

	if (params.codec_params) {
		codec = {
			...params.codec_params,
			vendor: params.vendor
		}
	}

	//const codec = params.codec_params ?? params // merge in vendor with params
	if (isServer()) {
		return await getAPI(codec)
	} else {
		const getResponse =
			(operation: CommerceOperation) =>
			async (args: any): Promise<any> => {
				const apiUrl = (window as any).isStorybook
					? 'https://core.dc-demostore.com/api'
					: '/api'
				return await (
					await axios.get(apiUrl, { params: { ...args, ...codec, operation } })
				).data
			}

		return {
			getProduct: getResponse('getProduct'),
			getProducts: getResponse('getProducts'),
			getCategory: getResponse('getCategory'),
			getMegaMenu: getResponse('getMegaMenu'),
			getCustomerGroups: getResponse('getCustomerGroups'),
			getVariants: getResponse('getVariants'),
			getRawProducts: getResponse('getRawProducts')
			//getPromotions: getResponse('getPromotions')
		}
	}
}

/**
 * TODO
 * @param req
 * @param res
 * @returns
 */
// handler for /api route
export const middleware = async (req, res) => {
	// CORS support
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', '*')
	res.setHeader('Access-Control-Allow-Methods', '*')

	const config = req.body || req.query
	const commerceAPI = await getCommerceAPI(config)
	switch (req.method.toLowerCase()) {
		case 'get':
		case 'post':
			return res.status(200).json(await commerceAPI[config.operation](config))

		case 'options':
			return res.status(200).send()

		default:
			break
	}
}

export default middleware
