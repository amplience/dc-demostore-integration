import _ from 'lodash'
import { DemoStoreConfiguration } from '../common/types'
import { CryptKeeper } from '../common/crypt-keeper'

export const getContentItem = async (hub: string, args: any): Promise<any> => {
    let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
    // console.log(`[ amp ] https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
    let response = await fetch(`https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
    return response.status === 200 ? CryptKeeper((await response.json()).content, hub).decryptAll() : null
}

export const getContentItemFromConfigLocator = async (configLocator: string): Promise<any> => {
    let [hub, lookup] = configLocator.split(':')
    if (lookup?.indexOf('/') === -1) {
        lookup = `config/${lookup}`
    }
    return await getContentItem(hub, { key: `demostore/${lookup}` }) ||
        await getContentItem(hub, { key: `aria/${lookup}` })
}

export const getDemoStoreConfig = async (key: string): Promise<DemoStoreConfiguration> => {
    let obj: any = await getContentItemFromConfigLocator(key)
    if (!obj) {
        throw `[ demostore ] Couldn't find config with key '${key}'`
    }

    // obj.commerce = obj.commerce && await getContentItem(hub, { id: obj.commerce.id })
    obj.algolia.credentials = _.keyBy(obj.algolia.credentials, 'key')
    obj.algolia.indexes = _.keyBy(obj.algolia.indexes, 'key')
    return obj
}

// getConfig still used in place of getDemoStoreConfig as of v1.1.3
export const getConfig = getDemoStoreConfig