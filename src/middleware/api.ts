import { AmplienceClient } from "../amplience";
import axios from "axios";
import { Category, CodecConfiguration, CommerceAPI, CommonArgs, Config, CustomerGroup, DemoStoreConfiguration, getCodec, GetCommerceObjectArgs, GetProductsArgs, Product } from "../index";
import { isServer } from "../index";

export const getConfig = async (configLocator: string): Promise<DemoStoreConfiguration> => await new AmplienceClient(configLocator).getConfig()
const getAPI = async (config: Config): Promise<CommerceAPI> => {
    let configLocator: string
    if ('config_locator' in config && config.config_locator) {
        configLocator = config.config_locator
    }
    return configLocator ?
        await getCodec((await getConfig(configLocator)).commerce) as CommerceAPI :
        await getCodec(config as CodecConfiguration) as CommerceAPI
}

const getResponse = async (query: any): Promise<any> => {
    const commerceAPI = await getAPI(query.params)

    if (!commerceAPI) {
        throw new Error(`commerceAPI not found for ${JSON.stringify(query.params)}`)
    }

    if (!commerceAPI[query.operation]) {
        throw new Error(`invalid operation: ${query.operation}`)
    }

    return isServer() ? await commerceAPI[query.operation](query.args) : await (await axios.post(`/api`, query)).data
}

export const getCommerceAPI = (params: Config): CommerceAPI => ({
    getProduct: async (args: GetCommerceObjectArgs): Promise<Product> => await getResponse({ params, args, operation: 'getProduct' }),
    getProducts: async (args: GetProductsArgs): Promise<Product[]> => await getResponse({ params, args, operation: 'getProducts' }),
    getCategory: async (args: GetCommerceObjectArgs): Promise<Category> => await getResponse({ params, args, operation: 'getCategory' }),
    getMegaMenu: async (args: CommonArgs): Promise<Category[]> => await getResponse({ params, args, operation: 'getMegaMenu' }),
    getCustomerGroups: async (args: CommonArgs): Promise<CustomerGroup[]> => await getResponse({ params, args, operation: 'getCustomerGroups' })
})

const handler = async (req, res) => {
    return res.status(200).json(await getResponse(req.body))
}
export default handler