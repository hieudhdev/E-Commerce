'use strict'

const { model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String, required: true, 
        enum: ['active', 'completed', 'fail', 'pending'],
        default: 'active'
    },
    cart_products: { type: Array, required: true, default: [] },
    /*  cart products
        [
            {
                productId,
                shopId,
                quantity,
                name,   // check in db once again when user order
                price
            },
        ]
    */
   cart_count_products: { type: Number, default: 0 },
   cart_userId: { type: Number, require: true },

}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = model(DOCUMENT_NAME, cartSchema)