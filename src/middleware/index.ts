import { getDemoStoreConfig } from "../amplience";
import axios from "axios";
import { CommerceAPI, getCommerceCodec } from "../index";
import { isServer } from "../common/util";

export type Config = ConfigLocatorBlock | any | undefined
export type ConfigLocatorBlock = {
    config_locator: string
}

export const baseConfigLocator = { config_locator: process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || process.env.STORYBOOK_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default` }
const getAPI = async (config: Config): Promise<CommerceAPI> => {
    if (!config) {
        // if undefined is passed then the config locator is specified by baseConfigLocator
        config = baseConfigLocator
    }

    if ('config_locator' in config) {
        // either we were passed in a config_locator or undefined, so let's get the credential block
        config = await (await getDemoStoreConfig(config.config_locator)).commerce
    }
    return await getCommerceCodec(config)
}

export type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups'

// getCommerceAPI is the main client interaction point with the integration layer
export const getCommerceAPI = async (params: Config): Promise<CommerceAPI> => {
    if (isServer()) {
        return await getAPI(params)
    }
    else {
        const getResponse = (operation: CommerceOperation) => async (args: any): Promise<any> => {
            const apiUrl = (window as any).isStorybook ? `https://core.dc-demostore.com/api` : `/api`
            return await (await axios.post(apiUrl, { ...args, ...params, operation })).data
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

    let commerceAPI = await getCommerceAPI(req.body)
    switch (req.method.toLowerCase()) {
        case 'post':
            return res.status(200).json(await commerceAPI[req.body.operation](req.body))

        case 'options':
            return res.status(200).send()

        default:
            break;
    }
}