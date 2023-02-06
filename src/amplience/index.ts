import _ from 'lodash'
import { DemoStoreConfiguration } from '../common/types'
import { CryptKeeper } from '../common/crypt-keeper'
import { IntegrationError } from '../common/errors'

/**
 * TODO
 * @param hub 
 * @param args 
 * @returns 
 */
export const getContentItem = async (hub: string, args: any): Promise<any> => {
    let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
    let response = await fetch(`https://${hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
    return response.status === 200 ? CryptKeeper((await response.json()).content, hub).decryptAll() : null
}

/**
 * TODO
 * @param configLocator 
 * @returns 
 */
export const getContentItemFromConfigLocator = async (configLocator: string): Promise<any> => {
    let [hub, lookup] = configLocator.split(':')
    let contentItem = await getContentItem(hub, { key: `demostore/${lookup}` })

    if (!contentItem) {
        // todo: add help url
        throw new IntegrationError({
            message: `no content item found for config_locator ${configLocator}`,
            helpUrl: ``
        })
    }
    return contentItem
}

/**
 * TODO
 * @param key 
 * @returns 
 */
export const getDemoStoreConfig = async (key: string): Promise<DemoStoreConfiguration> => {
    let obj: any = await getContentItemFromConfigLocator(key)
    return {
        ...obj,
        algolia: {
            credentials: _.keyBy(obj.algolia.credentials, 'key'),
            indexes: _.keyBy(obj.algolia.indexes, 'key')
        }        
    }
}

// getConfig still used in place of getDemoStoreConfig as of v1.1.3
export const getConfig = getDemoStoreConfig