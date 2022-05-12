import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { sleep } from '../util'
import _ from 'lodash'
import { CodecConfiguration } from '..'
import { HttpMethod } from 'dc-management-sdk-js'

export interface OAuthRestClientInterface {
    get: (config: AxiosRequestConfig | string) => Promise<any>
    patch: (config: AxiosRequestConfig | string) => Promise<any>
    delete: (config: AxiosRequestConfig | string) => Promise<any>
    post: (config: AxiosRequestConfig | string) => Promise<any>
}

export interface OAuthCodecConfiguration extends CodecConfiguration {
    auth_url: string
    api_url: string
}

export const OAuthProperties = {
    "api_url": {
        "title": "Base API URL",
        "type": "string",
        "minLength": 0,
        "maxLength": 100
    },
    "auth_url": {
        "title": "Oauth URL",
        "type": "string",
        "minLength": 0,
        "maxLength": 100
    }
}

export const ClientCredentialProperties = {
    client_id: {
        "title": "Client ID",
        "type": "string",
        "minLength": 0,
        "maxLength": 50
    },
    client_secret: {
        "title": "Client secret",
        "type": "string",
        "minLength": 0,
        "maxLength": 100
    }
}

// enum AuthenticationStatus {
//     NOT_LOGGED_IN,
//     LOGGING_IN,
//     LOGGED_ID
// }

type AuthenticationStatus = 'NOT_LOGGED_IN' | 'LOGGING_IN' | 'LOGGED_IN'

export const OAuthRestClient = (config: OAuthCodecConfiguration, payload: any, requestConfig: AxiosRequestConfig = {}, getHeaders?: (auth: any) => any) => {
    let authenticatedAxios: AxiosInstance
    let status: AuthenticationStatus = 'NOT_LOGGED_IN'

    const authenticate = async (): Promise<AxiosInstance> => {
        if (!authenticatedAxios) {
            let response = await axios.post(config.auth_url, payload, requestConfig)
            const auth = response.data

            if (!getHeaders) {
                getHeaders = (auth: any) => ({
                    Authorization: `${auth.token_type || 'Bearer'} ${auth.access_token}`
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

    const request = (method: HttpMethod) => async (config: AxiosRequestConfig | string): Promise<any> => {
        if (typeof config === 'string') {
            config = { url: config }
        }

        // authentication
        switch (status) {
            case 'LOGGING_IN':
                await sleep(100)
                return await request(method)(config)

            case 'NOT_LOGGED_IN':
                status = 'LOGGING_IN'
                break;

            case 'LOGGED_IN':
                break;
        }

        authenticatedAxios = await authenticate()

        if (status === 'LOGGING_IN') {
            status = 'LOGGED_IN'
        }

        try {
            // console.log(`[ rest ] get ${config.url}`)
            return await (await authenticatedAxios.request({ method, ...config })).data
        } catch (error: any) {
            if (error.response?.status === 429) {
                await sleep(1000)
                return await request(method)(config)
            }
            else if (error.response?.status === 404) {
                // don't throw on a 404 just return an empty result set
                return null
            }

            if (error.stack) {
                console.log(error.stack)
            }
            console.log(`Error while getting URL [ ${config.url} ]: ${error.message} ${error.code}`)
        }
    }

    return {
        get: request(HttpMethod.GET),
        delete: request(HttpMethod.DELETE),
        post: request(HttpMethod.POST),
        patch: request(HttpMethod.PATCH)
    }
}

export default OAuthRestClient