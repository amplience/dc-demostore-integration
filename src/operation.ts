import _ from 'lodash'
import https from 'https'

import { QueryContext } from "./types"
import { CodecConfiguration } from './codec/codec'
const request = require('axios')

/**
 * The base class for all operations.
 *
 * @public
 */
 export class Operation {
    config: CodecConfiguration

    // function identity<T>(arg: T): T {
    //     return arg;
    //   }

    getConfig<T extends CodecConfiguration>(): T {
        return this.config as T
    }

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
        let url = this.getURL(context)
        return url.toString()
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
            let requestParams = { url, method: context.method, headers: await this.getHeaders(), data: context.args.body }

            // if (args.body) {
            //     console.log(`data`)
            //     console.log(JSON.stringify(args.body))
            // }

            // let backendRequestId = `${this.config.getSource()}.${nanoid(10)}`
            // logger.info(`[ ${chalk.yellow(this.backend.config.context.requestId)} ][ ${args.method.padStart(6, ' ')} ] ${url}`)


            console.log(`[ ${context.method.toUpperCase()} ] ${requestParams.url}`)

            // next, execute the request with headers gotten from the backend
            let response = await request({ ...requestParams, httpsAgent })

            // log the response object
            // mask the auth token first if there is one
            if (requestParams.headers['authorization']) {
                requestParams.headers['authorization'] = requestParams.headers['authorization'].substring(0, requestParams.headers['authorization'].length - 8) + `********`
            }

            // this.backend.config.context.logger.logCodecCall({ 
            //     id: backendRequestId,
            //     request: requestParams,
            //     response: response.data
            // })
            // end logging the response object

            let x: any = await this.translateResponse(response.data, _.bind(this.export(context), this))
            x.getResults = () => x.results

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

            // use the backend to translate the result set
            // return x
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

    formatMoneyString(money, args) {
        return new Intl.NumberFormat(args.locale, {
            style: 'currency',
            currency: args.currency
        }).format(money);
    }
}