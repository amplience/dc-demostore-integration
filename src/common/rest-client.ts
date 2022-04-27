import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { sleep } from '../util'
import { Dictionary } from 'lodash'
import _ from 'lodash'
import { CodecConfiguration } from '..'

export interface OAuthRestClientInterface {
    authenticate: (payload: any, config: AxiosRequestConfig) => Promise<void>
    get: (config: AxiosRequestConfig) => Promise<any>
}

export interface OAuthCodecConfiguration extends CodecConfiguration {
    auth_url: string
    api_url: string
}

export const OAuthRestClient = (config: OAuthCodecConfiguration, payload: any, requestConfig: AxiosRequestConfig = {}, getHeaders?: (auth: any) => any) => {
    let authenticatedAxios: AxiosInstance

    const authenticate = async () => {
        if (!authenticatedAxios) {
            console.log(`[ aria ] oauth authenticate: ${config.auth_url}`)

            let response = await axios.post(config.auth_url, payload, requestConfig)
            const auth = response.data

            if (!getHeaders) {
                getHeaders = (auth: any) => ({
                    Authorization: `${auth.token_type} ${auth.access_token}`
                })
            }

            authenticatedAxios = axios.create({
                baseURL: config.api_url,
                headers: getHeaders(auth)
            })

            setTimeout(() => { authenticate() }, auth.expires_in * 999)
        }
        return authenticatedAxios
    }

    const get = async (config: AxiosRequestConfig): Promise<any> => {
        try {
            // console.log(`[ rest ] get ${config.url}`)
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