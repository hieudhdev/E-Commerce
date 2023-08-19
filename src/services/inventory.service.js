'use strict'

const inventory = require('../models/inventory.model')
const { BabRequestError } = require('../core/error.response')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {
    
    // nhap them hang vao kho
    static async addStockToInventory ({
        stock,
        productId,
        shopId,
        location = '138/58 tan trieu, thanh tri, hn'
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BabRequestError('This product not exist')

        const query = { inven_shopId: shopId, inven_productId: productId },
        updateSet = { 
            $in: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {
            upsert: true,
            new: true
        }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }

}

module.exports = InventoryService