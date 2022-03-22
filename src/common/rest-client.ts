import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { sleep } from '../util'
import { Dictionary } from 'lodash'

interface OAuthAuthorization {
    access_token: string
    expires: number
    token_type: string
    identifier: string
    expires_in: number
}

const cache: Dictionary<AxiosResponse> = {}

export interface OAuthRestClientInterface {
    authenticate: () => Promise<void>
    get: (config: AxiosRequestConfig) => Promise<any>
}

const OAuthRestClient = ({ api_url, auth_url, client_id, client_secret }) => {
    let authenticatedAxios: AxiosInstance

    const authenticate = async() => {
        console.log(`authenticating to ${auth_url}`)
        let response = await axios.post(auth_url, qs.stringify({
            grant_type: 'client_credentials',
            client_id,
            client_secret
        }))
        const auth = response.data
        console.log(`authenticated to ${auth_url}`)

        authenticatedAxios = axios.create({
            baseURL: api_url,
            headers: {
                Authorization: `${auth.token_type} ${auth.access_token}`
            }
        })
        setTimeout(() => { authenticate() }, auth.expires_in * 99)
    }

    const get = async (config: AxiosRequestConfig): Promise<any> => {
        try {
            let response: AxiosResponse = cache[config.url]
            if (!response) {
                // console.log(`[ get ] ${api_url}${config.url}`)

                response = await authenticatedAxios(config)
                cache[config.url] = response
                setTimeout(() => {
                    console.log(`[ delete ] ${config.url}`)
                    delete cache[config.url]
                }, 600000)
            }
            else {
                // console.log(`[ get ] ${apiUrl}${config.url} [ cached ]`)
            }
            return response.data
        } catch (error: any) {
            if (error.response.status === 429) {
                await sleep(1000)

                // console.log(`[ get ] ${apiUrl}${config.url} [ rate limited ]`)
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

class OAuthRestClientx {
    apiUrl: string
    authUrl: string
    clientId: string
    clientSecret: string

    auth: OAuthAuthorization

    authenticatedAxios: AxiosInstance

    constructor({ apiUrl, authUrl, clientId, clientSecret }) {
        this.apiUrl = apiUrl
        this.authUrl = authUrl
        this.clientId = clientId
        this.clientSecret = clientSecret
    }
}

export default OAuthRestClient