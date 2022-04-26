import { Product, Image, CustomerGroup } from "../../../types"
import { formatMoneyString } from "../../../util"
import Moltin, { Hierarchy } from "@moltin/sdk"
import _, { Dictionary } from "lodash"
import { AttributedProduct, ElasticPathCategory } from "."
import { EPCustomerGroup } from "./types"

const mappers = (api: any) => {
    const mapProduct = async (skeletonProduct: AttributedProduct): Promise<Product> => {
        if (!skeletonProduct) {
            return undefined
        }
    
        let product: AttributedProduct = await api.getProductById(skeletonProduct.id)
        if (!product) {
            return undefined
        }
    
        // let attributes: Attribute[] = []
        let attributes: Dictionary<string> = {}
        let images: Image[] = []
    
        if (product.relationships.main_image?.data?.id) {
            let mainImage = await api.getFileById(product.relationships.main_image?.data?.id)
            images.push({ url: mainImage?.link?.href })
        }
    
        let price = await api.getPriceForSku(product.attributes.sku)
        let productPrice = formatMoneyString(price.amount / 100, { currency: 'USD' })
    
        _.each(product.attributes?.extensions, (extension, key) => {
            _.each(extension, (v, k) => {
                if (k.indexOf('image') > -1) {
                    images.push({ url: v })
                }
                else if (v) {
                    attributes[k] = v
                }
            })
        })
    
        let variants = [{
            sku: product.attributes.sku,
            prices: {
                list: productPrice,
            },
            listPrice: productPrice,
            salePrice: productPrice,
            images,
            attributes,
            key: product.attributes.slug,
            id: product.id
        }]
    
        // variants
        if (!_.isEmpty((product.meta as any).variation_matrix)) {
            let variationMatrix: Dictionary<Dictionary<string>> = (product.meta as any).variation_matrix
            let x = _.flatMap(Object.keys(variationMatrix).map(key => {
                let variation = variationMatrix[key]
                let z = _.map
    
                return {
    
                }
            }))
        }
    
        return {
            id: product.id,
            slug: product.attributes.slug,
            name: product.attributes.name,
            shortDescription: product.attributes.description,
            longDescription: product.attributes.description,
            categories: [],
            variants
        }
    }
    
    const mapNode = (hierarchy: Hierarchy) => async (node: Moltin.Node): Promise<ElasticPathCategory> => ({
        hierarchyId: hierarchy.id,
        name: node.attributes.name,
        id: node.id,
        slug: `${hierarchy.attributes.slug}-${node.attributes.slug}`,
        children: await Promise.all((await api.getChildrenByNodeId(hierarchy.id, node.id)).map(await mapNode(hierarchy))),
        products: []
    })
    
    const mapHierarchy = async (hierarchy: Hierarchy): Promise<ElasticPathCategory> => ({
        hierarchyId: hierarchy.id,
        name: hierarchy.attributes.name,
        id: hierarchy.id,
        slug: hierarchy.attributes.slug,
        children: await Promise.all((await api.getChildrenByHierarchyId(hierarchy.id)).map(await mapNode(hierarchy))),
        products: []
    })

    const mapCustomerGroup = (customerGroup: EPCustomerGroup): CustomerGroup => ({
        ...customerGroup,
        name: customerGroup['group-name']
    })
    // end mappers    

    return {
        mapHierarchy,
        mapNode,
        mapProduct,
        mapCustomerGroup
    }
}

export default mappers