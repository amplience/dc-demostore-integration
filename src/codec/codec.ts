import _ from 'lodash'
import { Operation } from '../operation'
import { nanoid } from 'nanoid'
import { CommerceAPI } from '..'

export abstract class Codec {
    config: CodecConfiguration
    codecId: string = nanoid(8)

    constructor(config: CodecConfiguration) {
        this.config = config
    }

    async start() { }
}

let defaultArgs = {
    currency: 'USD',
    locale: 'en-US',
    language: 'en',
    country: 'US'
}

/**
 * CodecConfiguration is a representation of a configuration for one instance of a codec. It contains a codecKey
 * (in the format <code>vendor/key</code>) and a set of credentials
 *
 * @public
 */
export class CodecConfiguration {
    _meta?: {
        deliveryKey?: string
        deliveryId: string
        schema: string
    }
    value?: string
}

/**
 * CommerceCodec is the base class for codecs implementing the CommerceAPI interface.
 *
 * @public
 */
export abstract class CommerceCodec extends Codec implements CommerceAPI {
    productOperation: Operation
    categoryOperation: Operation

    async getCategory(args) {
        return await this.categoryOperation.get({ ...defaultArgs, ...args })
    }

    async getCategories(args) {
        return await this.categoryOperation.get({ ...defaultArgs, ...args })
    }

    async getProduct(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args })
    }

    async getProducts(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args })
    }

    async getProductsForCategory(category, args) {
        throw `getProductsForCategory must be implemented`
    }

    // future api
    async postCategory(args) {
        return await this.categoryOperation.post({ ...defaultArgs, ...args })
    }

    async postProduct(args) {
        return await this.productOperation.post({ ...defaultArgs, ...args })
    }

    async deleteProduct(args) {
        return await this.productOperation.delete({ ...defaultArgs, ...args })
    }
    // end future api
}