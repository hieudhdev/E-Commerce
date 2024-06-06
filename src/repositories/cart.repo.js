'use strict'

const cart = require('../models/cart.model')
const { convertToObjectId } = require('../helpers')

const findCartById = async (cartId) => {
    return await cart.findOne({ 
        _id: convertToObjectId(cartId),
        cart_state: 'active'
    }).lean()
}

const createUserCart = async ({ userId, products }) => {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateOrInsert = {
        $addToSet: {
            cart_products: products
        }
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate( query, updateOrInsert, options )
}

const updateUserCartQuantity = async ({ userId, products }) => {
    const { productId, quantity } = products
    const query = { 
        cart_userId: userId,
        'cart_products.productId': productId, // nếu truy cập vào property của obj thì cần trong ngoặc ''
        cart_state: 'active'
    }
    const updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate( query, updateSet, options )
}

module.exports = {
    findCartById,
    createUserCart,
    updateUserCartQuantity
}