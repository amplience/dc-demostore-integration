import { QueryContext } from '../../../types'
import _ from 'lodash'
import { CommerceCodec, CodecConfiguration } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AmplienceCommerceProductOperation, AmplienceCommerceCategoryOperation, AmplienceFetchOperation } from './operations'

const getFetchBody = array => ({ requests: _.map(_.take(array, 12), key => ({ key })) })
const mapContent = results => _.map(results.results, 'content')

export class AmplienceCommerceCodec extends CommerceCodec {
    fetchOperation: AmplienceFetchOperation

    constructor(config) {
        super(config)
        this.productOperation = new AmplienceCommerceProductOperation(config)
        this.categoryOperation = new AmplienceCommerceCategoryOperation(config)
        this.fetchOperation = new AmplienceFetchOperation(config)
    }

    async populateCategory(context: QueryContext) {
        let category = await this.categoryOperation.get(context)
        if (category.children.length > 0) {
            context.args = { body: getFetchBody(category.children) }
            category.children = mapContent(await this.fetchOperation.get(context))
        }
        if (category.products.length > 0) {
            context.args = { body: getFetchBody(category.products) }
            category.products = mapContent(await this.fetchOperation.get(context))
            category.products = _.map(category.products, this.productOperation.export(context))
        }
        await Promise.all(category.children.map(async cat => {
            if (cat.children.length > 0) {
                context.args = { body: getFetchBody(cat.children) }
                cat.children = mapContent(await this.fetchOperation.get(context))
            }
            if (cat.products.length > 0) {
                context.args = { body: getFetchBody(cat.products) }
                cat.products = mapContent(await this.fetchOperation.get(context))
                cat.products = _.map(cat.products, this.productOperation.export(context))
            }
        }))

        return category
    }

    async getCategoryHierarchy(context: QueryContext) {
        let categoryKeys = ['women', 'men', 'accessories', 'sale']
        return await Promise.all(categoryKeys.map(key => this.populateCategory(new QueryContext({ ...context, args: { slug: key } }))))
    }

    async getCategories(context: QueryContext) {
        return await this.getCategoryHierarchy(context)
    }

    async getCategory(context: QueryContext) {
        return await this.populateCategory(context)
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'commerce',

    validate: (config: any) => {
        return config && config.hubName
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceCommerceCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)