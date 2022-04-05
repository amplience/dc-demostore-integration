import _, { Dictionary } from 'lodash'
import { sleep } from '../util'

export interface CodecConfiguration {
    _meta?: {
        deliveryKey?: string
        deliveryId: string
        schema: string
    }
    locator?: string
}

export class Codec {
    SchemaURI: string
    async getAPI(config: CodecConfiguration): Promise<any> {}
}

const codecs: Dictionary<Codec> = {}
const cachedCodecs: Dictionary<any> = {}

export const registerCodec = (codec: Codec) => {
    console.log(`[ aria ] register codec [ ${codec.SchemaURI} ]`)
    codecs[codec.SchemaURI] = codec
}

export const getCodec = async (config: CodecConfiguration): Promise<any> => {
    let deliveryId = config?._meta?.deliveryId || ''
    if (!cachedCodecs[deliveryId]) {
        let codec: Codec = codecs[config?._meta?.schema]
        if (!codec) {
            throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
        }
        console.log(`[ aria ] use codec [ ${config?._meta?.schema} ]`)
        cachedCodecs[deliveryId] = await codec.getAPI(config)
    }
    return cachedCodecs[deliveryId]
}

import './codecs/bigcommerce'
import './codecs/commercetools'
import './codecs/elasticpath'
import './codecs/rest'