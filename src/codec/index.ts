import _, { Dictionary } from 'lodash'
import { nanoid } from 'nanoid'

export interface CodecGenerator {
    SchemaURI: string
    getInstance: (config: CodecConfiguration) => Promise<Codec>
}

export interface CodecConfiguration {
    _meta?: {
        deliveryKey?: string
        deliveryId: string
        schema: string
    }
}

export abstract class Codec {
    config: CodecConfiguration
    codecId: string = nanoid(8)

    constructor(config: CodecConfiguration) {
        this.config = config
    }
}

const codecTypes: Dictionary<CodecGenerator> = {}
const cachedCodecs: Dictionary<Codec> = {}

export const registerCodec = (codec: CodecGenerator) => codecTypes[codec.SchemaURI] = codec
export const getCodec = async (config: CodecConfiguration): Promise<any> => {
    let deliveryId = config?._meta?.deliveryId
    if (!deliveryId) {
        throw `[ aria ] no delivery id found on codec configuration`
    }

    if (!cachedCodecs[deliveryId]) {
        let codecGenerator: CodecGenerator = codecTypes[config?._meta?.schema]
        if (!codecGenerator) {
            throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
        }
        cachedCodecs[deliveryId] = await codecGenerator.getInstance(config)
    }

    return cachedCodecs[deliveryId]
}

import './codecs/rest'
