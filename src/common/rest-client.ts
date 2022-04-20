import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { sleep } from '../util'
import { Dictionary } from 'lodash'
import qs from 'qs'
import _ from 'lodash'

interface OAuthAuthorization {
    access_token: string
    expires: number
    token_type: string
    identifier: string
    expires_in: number
}

const cache: Dictionary<AxiosResponse> = {}

export interface OAuthRestClientInterface {
    authenticate: (payload: any, config: AxiosRequestConfig) => Promise<void>
    get: (config: AxiosRequestConfig) => Promise<any>
}

export const OAuthRestClient = ({ api_url, auth_url }, payload: any, config: AxiosRequestConfig = {}) => {
    let authenticatedAxios: AxiosInstance

    const authenticate = async () => {
        let response = await axios.post(auth_url, qs.stringify(payload), config)
        const auth = response.data

        authenticatedAxios = axios.create({
            baseURL: api_url,
            headers: {
                Authorization: `${auth.token_type} ${auth.access_token}`
            }
        })

        setTimeout(() => { authenticate() }, auth.expires_in * 999)
        return authenticatedAxios
    }

    const get = async (config: AxiosRequestConfig): Promise<any> => {
        try {
            authenticatedAxios = authenticatedAxios || await authenticate()
            return await (await authenticatedAxios.get(config.url, config)).data
        } catch (error: any) {
            if (error.response.status === 429) {
                await sleep(1000)
                return await get(config)
            }
            else if (error.response.status === 404) {
                // don't throw on a 404 just return an empty result set
                return { data: undefined }
            }

            if (error.stack) {
                console.log(error.stack)
            }
            console.log(`Error while getting URL [ ${config.url} ]: ${error.message} ${error.code}`)
        }
    }

    return {
        authenticate,
        get
    }
}

export default OAuthRestClient