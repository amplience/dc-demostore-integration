import { getContentItem, getContentItemFromConfigLocator } from "../amplience";
import axios from "axios";
import { CommerceAPI, CONSTANTS, getCommerceCodec } from "../index";
import { isServer } from "../common/util";
import { IntegrationError } from "../common/errors";

export type Config = ConfigLocatorBlock | any | undefined
export type ConfigLocatorBlock = {
    config_locator: string
}

export const baseConfigLocator = { config_locator: process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default` }

const getCommerceApiForConfigLocator = async (locator: string): Promise<CommerceAPI> => {
    let configItem: any = await getContentItemFromConfigLocator(locator)
    if (configItem) {
        if (configItem._meta?.schema === CONSTANTS.demostoreConfigUri) {
            return await getCommerceCodec(await getContentItem(locator.split(':')[0], { id: configItem.commerce.id }))
        }
        else {
            return await getCommerceCodec(configItem)
        }
    }
}

const getAPI = async (config: Config): Promise<CommerceAPI> => {
    config = {
        ...baseConfigLocator,
        ...config
    }

    let codec = await getCommerceCodec(config) || await getCommerceApiForConfigLocator(config.config_locator)
    if (codec) {
        return codec
    }
    throw new IntegrationError({ 
        message: `no codecs found (expecting 1) matching schema:\n${JSON.stringify(config, undefined, 4)}`,
        helpUrl: `https://foo.bar` 
    })
}

export type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups'

// getCommerceAPI is the main client interaction point with the integration layer
export const getCommerceAPI = async (params: Config = undefined): Promise<CommerceAPI> => {
    if (isServer()) {
        return await getAPI(params)
    }
    else {
        const getResponse = (operation: CommerceOperation) => async (args: any): Promise<any> => {
            const apiUrl = (window as any).isStorybook ? `https://core.dc-demostore.com/api` : `/api`
            return await (await axios.get(apiUrl, { params: { ...args, ...params, operation } })).data
        }

        return {
            getProduct: getResponse('getProduct'),
            getProducts: getResponse('getProducts'),
            getCategory: getResponse('getCategory'),
            getMegaMenu: getResponse('getMegaMenu'),
            getCustomerGroups: getResponse('getCustomerGroups')
        }
    }
}

// handler for /api route
export const middleware = async (req, res) => {
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')

    let config = req.body || req.query
    let commerceAPI = await getCommerceAPI(config)
    switch (req.method.toLowerCase()) {
        case 'get':
        case 'post':
            return res.status(200).json(await commerceAPI[config.operation](config))

        case 'options':
            return res.status(200).send()

        default:
            break;
    }
}
export default middleware