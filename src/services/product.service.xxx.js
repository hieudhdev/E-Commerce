'use strict'

const { product, electronic, clothing, furniture } = require('../models/product.model')
const { AuthFailureError, NotFoundError, BabRequestError } = require('../core/error.response')
const { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishForShop
} = require('../models/repositories/product.repo')

// define Factory class to create a product (FACTORY DESIGN METHOD)
class ProductFactory {
    
    // add product
    static productRegistry = {} // key: class

    static registerProductType (type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct (type, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BabRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
    }

    // PUT publish product
    static async publishProductByShop ({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    // END PUT

    // QUERY product
    static async findAllDraftsForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
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

    async createProduct (product_id) {
        return await product.create({ ...this, _id: product_id })
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