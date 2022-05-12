import { getDemoStoreConfig } from "../amplience";
import axios from "axios";
import { Category, CodecConfiguration, CommerceAPI, CommonArgs, Config, CustomerGroup, DemoStoreConfiguration, getCodec, GetCommerceObjectArgs, GetProductsArgs, Product } from "../index";
import { isServer } from "../index";

const getAPI = async (config: Config): Promise<CommerceAPI> => {
    let configLocator: string
    if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator
    }
    return configLocator ?
        await getCodec((await getDemoStoreConfig(configLocator)).commerce) as CommerceAPI :
        await getCodec(config as CodecConfiguration) as CommerceAPI
}

const getResponse = async (req: any): Promise<any> => {
    const commerceAPI = await getAPI(req.params)
    if (!commerceAPI) {
        throw new Error(`commerceAPI not found for ${JSON.stringify(req.params)}`)
    }

    const operation = commerceAPI[req.operation]
    if (!operation) {
        throw new Error(`invalid operation: ${req.operation}`)
    }

    let apiUrl = `/api`
    if (typeof window !== 'undefined' && (window as any).isStorybook) {
        apiUrl = `https://core.dc-demostore.com/api`
    }
    return isServer() ? await operation(req.args) : await (await axios.post(apiUrl, req)).data
}

export const getCommerceAPI = (params: Config): CommerceAPI => ({
    getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => await getResponse({ params, args, operation: 'getProduct' }),
    getProducts: async (args: GetProductsArgs): Promise<Product[]> => await getResponse({ params, args, operation: 'getProducts' }),
    getCategory: async (args: GetCommerceObjectArgs): Promise<Category> => await getResponse({ params, args, operation: 'getCategory' }),
    getMegaMenu: async (args: CommonArgs): Promise<Category[]> => await getResponse({ params, args, operation: 'getMegaMenu' }),
    getCustomerGroups: async (args: CommonArgs): Promise<CustomerGroup[]> => await getResponse({ params, args, operation: 'getCustomerGroups' })
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