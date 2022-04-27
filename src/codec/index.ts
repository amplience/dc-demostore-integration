import _, { Dictionary } from 'lodash'

export type CodecConfiguration = {
    _meta?: {
        deliveryKey?: string
        deliveryId: string
        schema: string
    }
    locator?: string
}

export interface Codec {
    SchemaURI: string
    getAPI(config: CodecConfiguration): any
}

export interface CommerceCodec extends Codec {
    getAPI(config: CodecConfiguration): CommerceAPI
}

const codecs: Codec[] = []
export const getCodecs = (): Codec[] => {
    return codecs
}

export const registerCodec = (codec: Codec) => {
    // console.log(`[ aria ] register codec ${codec.SchemaURI}`)
    if (!codecs.includes(codec)) {
        codecs.push(codec)
    }
}

export const getCodec = (config: CodecConfiguration): API => {
    // let codec: Codec = codecs[config?._meta?.schema] || _.find(Object.values(codecs), c => c.canUseConfiguration(config))
    let codec: Codec = _.find(codecs, c => !!c.getAPI(config))
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }

    let api = codec.getAPI(config)
    _.each(api, (method: any, key: string) => {
        if (typeof api[key] === 'function') {
            // apply default arguments for those not provided in the query
            api[key] = async (args: CommonArgs): Promise<any> => await method({
                locale: 'en-US',
                language: 'en',
                country: 'US',
                currency: 'USD',
                segment: '',
                ...args
            })
        }
    })
    return api
}

import './codecs/bigcommerce'
import './codecs/commercetools'
import './codecs/sfcc'
import './codecs/elasticpath'
import './codecs/rest'
import './codecs/fabric'
import './codecs/hybris'
import { API, CommerceAPI, CommonArgs } from '..'
