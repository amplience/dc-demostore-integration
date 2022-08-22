import { getContentItem, getContentItemFromConfigLocator } from "../amplience";
import axios from "axios";
import { CommerceAPI, CONSTANTS, getCodecs, getCommerceCodec } from "../index";
import { isServer } from "../common/util";

const getAPI = async (config: any): Promise<CommerceAPI> => {
    // we are passed in an object here
    //   - if it does not the key 'config_locator', it is assumed to be the config block for a codec
    //   - else retrieve the object
    //     - if the schema of the object is NOT the demostoreconfig, it is assumed to be the config block
    //     - else retrieve the object with id <demostoreconfig.commerce.id>

    if ('config_locator' in config) {
        const [ hub, _ ] = config.config_locator.split(':')
        config = await getContentItemFromConfigLocator(config.config_locator)
        if (config._meta.schema === CONSTANTS.demostoreConfigUri) {
            config = await getContentItem(hub, config.commerce)
        }
    }

    // novadev-582 Update SFCC codec to use client_id and client_secret to generate the api token if it doesn't exist
    let matchingCodec = getCodecs().find(c => c.vendor === config.vendor || c.schemaUri === config._meta.schema)
    config = await matchingCodec.postProcess(config)
    // end novadev-582

    return await getCommerceCodec(config)
}

export type CommerceOperation = 'getProduct' | 'getProducts' | 'getCategory' | 'getMegaMenu' | 'getCustomerGroups'

// getCommerceAPI is the main client interaction point with the integration layer
export const getCommerceAPI = async (params: any = undefined): Promise<CommerceAPI> => {
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