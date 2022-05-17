import { getDemoStoreConfig } from "../amplience";
import axios from "axios";
import { Category, CommerceAPI, CommonArgs, Config, CustomerGroup, getCommerceCodec, GetCommerceObjectArgs, GetProductsArgs, Product } from "../index";
import { isServer } from "../index";

export const baseConfigLocator = process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || process.env.STORYBOOK_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default`
const getAPI = async (config: Config): Promise<CommerceAPI> => {
    let configLocator: string
    if (!config) {
        configLocator = baseConfigLocator
    }
    else if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator
    }

    return configLocator ?
        await getCommerceCodec((await getDemoStoreConfig(configLocator)).commerce) :
        await getCommerceCodec(config)
}

const getResponse = (operation: string) => (params: any) => async (args: any): Promise<any> => {
    const commerceAPI = await getAPI(params)
    if (!commerceAPI) {
        throw new Error(`commerceAPI not found for ${JSON.stringify(params)}`)
    }

    const method = commerceAPI[operation]
    if (!method) {
        throw new Error(`invalid operation: ${operation}`)
    }

    const apiUrl = typeof window !== 'undefined' && (window as any).isStorybook ? `https://core.dc-demostore.com/api` : `/api`
    return isServer() ? await method(args) : await (await axios.post(apiUrl, { ...args, ...params })).data
}

export const getCommerceAPI = (params: Config): CommerceAPI => ({
    getProduct:         getResponse('getProduct')(params),
    getProducts:        getResponse('getProducts')(params),
    getCategory:        getResponse('getCategory')(params),
    getMegaMenu:        getResponse('getMegaMenu')(params),
    getCustomerGroups:  getResponse('getCustomerGroups')(params)
})

const handler = async (req, res) => { 
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    
    switch (req.method.toLowerCase()) {
        case 'post':
            return res.status(200).json(await getResponse(req.body))             

        case 'options':
            return res.status(200).send()

        default:
            break;
    }
}
export default handler