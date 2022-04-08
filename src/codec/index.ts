import _, { Dictionary } from 'lodash'

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
    async getAPI(config: CodecConfiguration): Promise<any> { }
}

const codecs: Dictionary<Codec> = {}
const cache: Dictionary<Codec> = {}

export const registerCodec = (codec: Codec) => {
    console.log(`[ aria ] register codec [ ${codec.SchemaURI} ]`)
    codecs[codec.SchemaURI] = codec
}

export const getCodec = async (config: CodecConfiguration): Promise<any> => {
    let codec: Codec = codecs[config?._meta?.schema]
    if (!codec) {
        throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
    }
    return await codec.getAPI(config)
}

import './codecs/bigcommerce'
import './codecs/commercetools'
import './codecs/sfcc'
import './codecs/elasticpath'
import './codecs/rest'