import { getCommerceAPI } from "../index";

export const getResponse = async (query: any): Promise<any> => {
    const commerceAPI = await getCommerceAPI(query)
    if (!commerceAPI[query.operation]) {
        throw new Error(`invalid operation: ${query.operation}`)
    }
    return await commerceAPI[query.operation](query)
}

const handler = async (req, res) => res.status(200).json(await getResponse(req.query))
export default handler