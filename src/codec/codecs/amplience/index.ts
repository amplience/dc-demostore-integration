import _ from 'lodash'
import { CodecConfiguration, ConfigCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AMPRSAConfiguration } from '../../../types'
import { ContentItem } from 'dc-management-sdk-js'

export class AmplienceConfigCodec extends ConfigCodec {
    hub: string
    environment: string

    constructor(key: string) {
        super({})
        this.hub = key.split(':')[0]
        this.environment = key.split(':')[1]
    }

    async getContentItem(args: any): Promise<ContentItem> {
        let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
        let url = `https://${this.hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`
        let response = await fetch(url)
        return (await response.json()).content
    }

    async getConfig(): Promise<AMPRSAConfiguration> {
        let obj: any = await this.getContentItem({ key: `aria/env/${this.environment}` })
        if (!obj) {
            throw `[ aria ] Couldn't find config with key '${this.hub}:${this.environment}'`
        }

        obj.commerce = obj.commerce && await this.getContentItem({ id: obj.commerce.id })
        obj.cms.hubs = _.keyBy(obj.cms.hubs, 'key')
        obj.algolia.credentials = _.keyBy(obj.algolia.credentials, 'key')
        obj.algolia.indexes = _.keyBy(obj.algolia.indexes, 'key')

        return obj as AMPRSAConfiguration
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'config',

    validate: (config: any) => {
        return config.value
    },

    create: (config: CodecConfiguration) => {
        if (!config.value) {
            throw `[ aria ] config.value not found`
        }
        return new AmplienceConfigCodec(config.value)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)