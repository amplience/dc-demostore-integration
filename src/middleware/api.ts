import { getDemoStoreConfig } from "../amplience";
import axios from "axios";
import { Category, CodecConfiguration, CommerceAPI, CommonArgs, Config, CustomerGroup, DemoStoreConfiguration, getCodec, GetCommerceObjectArgs, GetProductsArgs, Product } from "../index";
import { isServer } from "../index";

export const baseConfigLocator = process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || process.env.STORYBOOK_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default`
const getAPI = async (config: Config): Promise<CommerceAPI> => {
    let configLocator: string
    if (!config || !config.hasOwnProperty('config_locator')) {
        configLocator = baseConfigLocator
    }
    else if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator
    }
    return configLocator ?
        await getCodec((await getDemoStoreConfig(configLocator)).commerce) as CommerceAPI :
        await getCodec(config as CodecConfiguration) as CommerceAPI
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
const handler = async (req, res) => {
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')

    let commerceAPI = await getCommerceAPI(req.body || req.query)
    switch (req.method.toLowerCase()) {
        case 'get':
            return res.status(200).json(await commerceAPI[req.query.operation](req.query))

        case 'post':
            return res.status(200).json(await commerceAPI[req.body.operation](req.body))

        case 'options':
            return res.status(200).send()

        default:
            break;
    }
}
export default handler