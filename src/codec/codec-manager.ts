import _, { Dictionary } from 'lodash'
import { Codec, CodecConfiguration } from './codec'
import { CommerceCodec } from '..';

export class CodecType {
    vendor: string
    codecType: string
    validate: (config: any) => boolean
    create: (config: any) => Codec
}

export class CodecManager {
    codecTypes: {} = {}
    startTime: number
    cachedCodecs: Dictionary<Codec> = {}

    constructor() {
        this.startTime = new Date().getUTCMilliseconds()
    }

    registerCodecType(codecType: CodecType) {
        let key: string = `${codecType.vendor}-${codecType.codecType}`
        let existing: CodecType = this.codecTypes[key]
        if (!existing) {
            // console.log(`registerCodecType: ${key}`)
            this.codecTypes[key] = codecType
        }
    }
    
    async getCommerceCodec(codecKey: string | any): Promise<CommerceCodec> {
        return await this.getCodec(codecKey, "commerce") as CommerceCodec
    }

    async getCodec(config: CodecConfiguration, codecType: string): Promise<Codec> { 
        // console.log(`[ aria ] registered codecs: ${_.map(Object.values(this.codecTypes), ct => `${ct.vendor}-${ct.codecType}`)}`)
        let codecs: CodecType[] = _.filter(Object.values(this.codecTypes), (c: CodecType) => {
            return (codecType === c.codecType) && c.validate(config)
        })

        if (_.isEmpty(codecs)) {
            throw `[ aria ] no codecs found matching schema [ ${JSON.stringify(config)} ]`
        }
        else if (codecs.length > 1) {
            throw `[ aria ] multiple codecs found for schema [ ${JSON.stringify(config)} ], further disambiguation required`
        }

        if (config?._meta?.deliveryId && this.cachedCodecs[config?._meta?.deliveryId]) {
            return this.cachedCodecs[config?._meta?.deliveryId]
        }

        let codec = codecs[0].create(config)
        await codec.start()
        this.cachedCodecs[config?._meta?.deliveryId] = codec
        return codec
    }    
}

if (!global.codecManager) {
    global.codecManager = new CodecManager()
}

// create the codec manager and register types we know about
export const codecManager = global.codecManager

import './codecs/rest'