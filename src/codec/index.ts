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
    getAPI(config: CodecConfiguration): Promise<API>
    canUseConfiguration(config: CodecConfiguration): boolean
}

const codecs: Dictionary<Codec> = {}
export const registerCodec = (codec: Codec) => {
    console.log(`[ aria ] register codec [ ${codec.SchemaURI} ]`)
    codecs[codec.SchemaURI] = codec
}

export const getCodec = async (config: CodecConfiguration): Promise<any> => {
    let codec: Codec = codecs[config?._meta?.schema] || _.find(Object.values(codecs), c => c.canUseConfiguration(config))
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }
    let api = await codec.getAPI(config)

    _.each(Object.keys(api), key => {
        let method = api[key]
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
import { API, CommerceAPI, CommonArgs } from '..'
