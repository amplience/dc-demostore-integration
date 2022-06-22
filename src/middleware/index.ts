import { getContentItem, getContentItemFromConfigLocator } from "../amplience";
import axios from "axios";
import { CommerceAPI, CONSTANTS, getCommerceCodec } from "../index";
import { isServer } from "../common/util";

export type Config = ConfigLocatorBlock | any | undefined
export type ConfigLocatorBlock = {
    config_locator: string
}

export const baseConfigLocator = { config_locator: process.env.NEXT_PUBLIC_DEMOSTORE_COMMERCE_LOCATOR || process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default` }
const getAPI = async (config: Config): Promise<CommerceAPI> => {
    config = {
        ...baseConfigLocator,
        ...config
    }

    if ('config_locator' in config) {
        let configItem: any = await getContentItemFromConfigLocator(config.config_locator)
        if (configItem?._meta?.schema === CONSTANTS.demostoreConfigUri) {
            config = await getContentItem(config.config_locator.split(':')[0], { id: configItem.commerce.id })
        }
        else {
            config = configItem
        }
    }
    return await getCommerceCodec(config)
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
            getProduct:         getResponse('getProduct'),
            getProducts:        getResponse('getProducts'),
            getCategory:        getResponse('getCategory'),
            getMegaMenu:        getResponse('getMegaMenu'),
            getCustomerGroups:  getResponse('getCustomerGroups')
        }
    }
}

// handler for /api route
export const apiRouteHandler = async (req, res) => {
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