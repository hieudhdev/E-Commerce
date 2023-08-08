'use strict'

const { product, electronic, clothing, furniture } = require('../models/product.model')
const { AuthFailureError, NotFoundError, BabRequestError } = require('../core/error.response')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { 
    findAllDraftsForShop, 
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')

const { 
    insertInventory 
} = require('../models/repositories/inventory.repo')

// define Factory class to create a product (FACTORY DESIGN METHOD)
class ProductFactory {
    
    // CREATE
    static productRegistry = {} // key: class

    static registerProductType (type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct (type, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BabRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
    }

    // UPDATE
    static async updateProduct (type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BabRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // PUT 
    static async publishProductByShop ({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop ({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    // END PUT

    // QUERY
    static async findAllDraftsForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts ({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    // find products for homePage
    static async findAllProducts ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ 
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop'] 
        })
    }

    static async findProduct ({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
    // END QUERY
}

// define base product class
class Product {

    constructor({
        product_name, product_thumb, product_description, product_price, 
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct (product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            // add product_stock into inventory collection
            await insertInventory({ 
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct;
    }

    // update new product
    async updateProduct (productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }

}

// define sub-class for product type = clothing
class Clothing extends Product {
    // override method
    async createProduct () {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BabRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BabRequestError('Create new Product error')

        return newProduct
    }

    // override method
    async updateProduct (productId) {
        // 1 - remove atrributes has value undefine, null
        // 2 - check where the update is? PRODUCT or CLOTHING, ELECTRONICS, ...
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({ 
                productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing 
            })
        }

        const updateProduct = await super.updateProduct( productId, updateNestedObjectParser(objectParams) )
        return updateProduct
    }
}

// define sub-class for product type = electronics
class Electronics extends Product {
    // override method
    async createProduct () {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BabRequestError('Create new Electronics error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BabRequestError('Create new Product error')

        return newProduct
    }
}

// define sub-class for product type = furniture
class Furniture extends Product {
    // override method
    async createProduct () {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BabRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BabRequestError('Create new Product error')

        return newProduct
    }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)
// ProductFactory.registerProductTypes('Furniture', Furniture)  => add another model

module.exports = ProductFactory