import _, { Dictionary } from 'lodash'

export interface CodecConfiguration {
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
    canUseConfiguration(config: CodecConfiguration): boolean
}

export interface CommerceCodec extends Codec {
    getAPI(config: CodecConfiguration): CommerceAPI
}

const codecs: Dictionary<Codec> = {}
export const registerCodec = (codec: Codec) => {
    // console.log(`[ aria ] register codec ${codec.SchemaURI}`)
    codecs[codec.SchemaURI] = codec
}

export const getCodec = <T extends API>(config: CodecConfiguration): T => {
    let codec: Codec = codecs[config?._meta?.schema] || _.find(Object.values(codecs), c => c.canUseConfiguration(config))
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }
    
    let api = codec.getAPI(config)
    _.each(api, (method: any, key: string) => {
        // apply default arguments for those not provided in the query
        api[key] = async (args: CommonArgs): Promise<any> => await method({
            locale: 'en-US',
            language: 'en',
            country: 'US',
            currency: 'USD',
            segment: '',
            ...args
        })
    })
    return api
}

import './codecs/bigcommerce'
import './codecs/commercetools'
import './codecs/sfcc'
import './codecs/elasticpath'
import './codecs/rest'
import './codecs/fabric'
import { API, CommerceAPI, CommonArgs } from '..'
