import _ from 'lodash'
import https from 'https'

import { QueryContext } from '../../../types'
import { CodecConfiguration } from '../../'
import axios, { AxiosRequestConfig, Method } from 'axios'

/**
 * The base class for all operations.
 *
 * @public
 */
 export class Operation {
    config: CodecConfiguration

    constructor(config: CodecConfiguration) {
        this.config = config
    }

    import(native) {
        return native
    }

    export(context: QueryContext) {
        return native => native
    }

    async get(context: QueryContext) {
        context.method = 'get'
        return await this.doRequest(context)
    }

    async post(context: QueryContext) {
        context.method = 'post'
        return await this.doRequest(context)
    }

    async put(context: QueryContext) {
        context.method = 'put'
        return await this.doRequest(context)
    }

    async delete(context: QueryContext) {
        context.method = 'delete'
        return await this.doRequest(context)
    }

    getURL(context: QueryContext) {
        return `${this.getBaseURL()}${this.getRequestPath(context)}`
    }

    getBaseURL() {
        throw "getBaseURL must be defined in an operation subclass"
    }

    getRequestPath(context: QueryContext) {
        return ""
    }

    getRequest(context: QueryContext) {
        return this.getURL(context).toString()
    }

    postProcessor(context: QueryContext) {
        return native => native
    }

    async doRequest(context: QueryContext) {
        // get the URL from the backend
        let url = this.getRequest(context)

        context.args = context.args || {}

        try {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            let requestParams: AxiosRequestConfig = { url, method: context.method, headers: await this.getHeaders() }

            if (context.args.body) {
                requestParams.data = context.args.body
            }

            console.log(`[ ${context.method.toUpperCase()} ] ${requestParams.url}`)

            // next, execute the request with headers gotten from the backend
            let response = await axios({ ...requestParams, httpsAgent })

            // log the response object
            // mask the auth token first if there is one
            if (requestParams.headers['authorization']) {
                // requestParams.headers['authorization'] = requestParams.headers['authorization'].substring(0, requestParams.headers['authorization'].length - 8) + `********`
            }

            let x: any = await this.translateResponse(response.data, _.bind(this.export(context), this))
            if (x) {
                let px = await this.postProcessor(context)
                if (px) {
                    x.results = await px(x.results)
                }

                if (context.args.id || context.args.slug || requestParams.url.indexOf('where=slug') > -1 || requestParams.url.indexOf('/key=') > -1) {
                    return _.first(x.results)
                }
                else {
                    return x
                }
            }
            else if (context.args.method === 'delete') {
                return context.args.id
            }
        } catch (error) {
            console.error(error)
        }

        return {}
    }

    translateResponse(data: any, arg1: any) {
        throw "Method not implemented."
    }

    getHeaders() {
        return {}
    }
}