import _, { Dictionary } from 'lodash'
import { Codec } from './codec'
import { CMSCodec, CommerceCodec, ConfigCodec } from '..';

export class CodecType {
    vendor: string
    codecType: string
    validate: (config: any) => boolean
    create: (config: any) => Codec
}

export class CodecManager {
    codecTypes: {} = {}
    credentialLookupStrategy: (key: string) => any = __ => {}
    startTime: number
    cachedCodecs: Dictionary<Codec> = {}

    constructor() {
        this.startTime = new Date().getUTCMilliseconds()
    }

    registerCodecType(codecType: CodecType) {
        let key: string = `${codecType.vendor}-${codecType.codecType}`
        let existing: CodecType = this.codecTypes[key]
        if (!existing) {
            this.codecTypes[key] = codecType
        }
    }
    
    async getCommerceCodec(codecKey: string | any): Promise<CommerceCodec> {
        return await this.getCodec(codecKey, "commerce") as CommerceCodec
    }

    async getCMSCodec(codecKey: string | any): Promise<CMSCodec> {
        return await this.getCodec(codecKey, "cms") as CMSCodec
    }

    async getConfigCodec(codecKey: string | any): Promise<ConfigCodec> {
        return await this.getCodec(codecKey, "config") as ConfigCodec
    }

    async getCodec(codecKey: string | any, codecType: string): Promise<Codec> {
        let credentials: any = codecKey

        if (typeof codecKey === 'string') {
            credentials = await this.credentialLookupStrategy(codecKey)
            if (!credentials) {
                throw `[ aria ] no credentials found for codec key [ ${codecKey} ]`
            }    
        }
        else if (typeof codecKey === 'object') {
            codecKey = 'none'
        }
 
        // console.log(`[ aria ] registered codecs: ${_.map(Object.values(this.codecTypes), ct => `${ct.vendor}-${ct.codecType}`)}`)
        let codecs: CodecType[] = _.filter(Object.values(this.codecTypes), (c: CodecType) => {
            return (codecType === c.codecType) && c.validate(credentials)
        })
        if (_.isEmpty(codecs)) {
            throw `[ aria ] no codecs found matching [ ${ codecKey === 'none' ? JSON.stringify(credentials) : codecKey } ]`
        }
        else if (codecs.length > 1) {
            throw `[ aria ] multiple codecs found for key [ ${codecKey} ], must specify vendor in request`
        }

        if (credentials?._meta?.deliveryId && this.cachedCodecs[credentials?._meta?.deliveryId]) {
            return this.cachedCodecs[credentials?._meta?.deliveryId]
        }

        let codec = codecs[0].create(credentials)
        await codec.start()
        this.cachedCodecs[credentials?._meta?.deliveryId] = codec
        return codec
    }    
}

if (!global.codecManager) {
    global.codecManager = new CodecManager()
}

// create the codec manager and register types we know about
export const codecManager = global.codecManager

import './codecs'
