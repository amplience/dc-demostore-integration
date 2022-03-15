import _ from 'lodash'
import { CodecConfiguration, CMSCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'

import { DynamicContent, ContentItem } from 'dc-management-sdk-js'
import { AmplienceDCCodecConfiguration } from './operations'

export class AmplienceDCCMSCodec extends CMSCodec {
    dc: DynamicContent

    constructor(config: CodecConfiguration) {
        super(config)
        let c: AmplienceDCCodecConfiguration = (this.config as AmplienceDCCodecConfiguration)
        this.dc = new DynamicContent({ client_id: c.client_id, client_secret: c.client_secret })
    }

    async getContentItem(payload): Promise<ContentItem> {
        return await this.dc.contentItems.get(payload.payload.id)
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'cms',

    validate: (config: any) => {
        return config && 
            config.client_id &&
            config.client_secret
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceDCCMSCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)