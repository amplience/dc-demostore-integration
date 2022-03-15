import { QueryContext } from '../../../types'
import _ from 'lodash'
import URI from 'urijs'

import { Operation } from '../../../operation'
import { CodecConfiguration } from '../../codec'

export class AmplienceCodecConfiguration extends CodecConfiguration {
    hub: string
    environment: string
}

export class AmplienceDCCodecConfiguration extends CodecConfiguration {
    client_id: string
    client_secret: string
}

class AmplienceCommerceOperation extends Operation {
    defaultQuery: any = {}

    constructor(config) {
        super(config)
        this.defaultQuery = {
            depth: 'all',
            format: 'inlined'
        }
    }

    getBaseURL() {
        return `https://${(this.config as AmplienceCodecConfiguration).hub}.cdn.content.amplience.net/content`
    }

    getRequest(context: QueryContext) {
        let uri = new URI(this.getURL(context))
        uri.addQuery(this.defaultQuery)
        return uri.toString()
    }

    async translateResponse(data, mapper = (x => x)) {
        // a AmplienceCommerce response will be either a single object, or an array in 'results'
        // if it is an array, limit, count, total, and offset are provided on the object

        return {
            // revisit this
            meta: data.responses && {
                limit: data.responses.length,
                count: data.responses.length,
                offset: 0,
                total: data.responses.length
            },
            results: await Promise.all((data.responses || [data.content]).map(await mapper))
        }
    }
}

 export class AmplienceFetchOperation extends AmplienceCommerceOperation {
    constructor(config) {
        super(config)
        this.defaultQuery = {}
    }

    getRequestPath(context: QueryContext) {
        return `/fetch`
    }

    async get(context: QueryContext) {
        return await super.post(context)
    }
}

// category operation
export class AmplienceCommerceCategoryOperation extends AmplienceCommerceOperation {
    constructor(config) {
        super(config)
    }

    export(context: QueryContext) {
        return x => ({ ...x })
    }

    getRequestPath(context: QueryContext) {
        return context.args.slug && `/key/category-${context.args.slug}` || context.args.id && `/id/${context.args.id}`
    }
}
// end category operations

// product operation
export class AmplienceCommerceProductOperation extends AmplienceCommerceOperation {
    constructor(config) {
        super(config)
    }

    export(context: QueryContext) {
        return product => {
            return ({
                ...product,
                imageSetId: product.variants[0]?.attributes['articleNumberMax'] || null,
                variants: _.map(product.variants, variant => ({
                    ...variant,
                    images: _.map(variant.images, i => ({ url: i })),
                    prices: {
                        list: variant.listPrice,
                        sale: variant.salePrice
                    }
                }))
            })
        }
    }

    async get(context: QueryContext) {
        if (context.args?.productIds) {
            return { results: await Promise.all(_.map(context.args?.productIds.split(','), p => p.replace('product-', '')).map(async slug => await this.get(new QueryContext({ ...context, args: { slug } })))) }
        }
        else if (context.args?.keyword) {
            // algolia?
            return []
        }
        else {
            return await super.get(context)
        }
    }

    getRequestPath(context: QueryContext) {
        return context.args?.slug && `/key/product-${context.args?.slug}`
            || context.args?.id && `/id/${context.args?.id}`
    }
}
