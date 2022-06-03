import _ from 'lodash'
import { DemoStoreConfiguration } from '../types'
import { ContentItem } from 'dc-management-sdk-js'
import { CryptKeeper } from '..'

const getContentItem = async (hub: string, args: any): Promise<ContentItem> => {
    let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
    let response = await fetch(`https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
    return response.status === 200 ? CryptKeeper((await response.json()).content, hub).decryptAll() : null
}

const getDemoStoreConfig = async (key: string): Promise<DemoStoreConfiguration> => {
    let [hub, lookup] = key.split(':')

    // look up aria/env as a fallback to demostore/config for backward compatibility
    let obj: any = await getContentItem(hub, { key: `demostore/config/${lookup}` }) ||
        await getContentItem(hub, { key: `aria/env/${lookup}` })

    if (!obj) {
        throw `[ demostore ] Couldn't find config with key '${key}'`
    }

    obj.commerce = obj.commerce && await getContentItem(hub, { id: obj.commerce.id })
    obj.algolia.credentials = _.keyBy(obj.algolia.credentials, 'key')
    obj.algolia.indexes = _.keyBy(obj.algolia.indexes, 'key')
    obj.locator = key

    return obj as DemoStoreConfiguration
}

export {
    getDemoStoreConfig
}