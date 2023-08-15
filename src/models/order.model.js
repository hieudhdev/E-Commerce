'use strict'

const { model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /* 
        order_checkout: {
            totalPrice,
            totalApplyDiscount,
            feeShip,
            totalCheckout
        }
    */
    order_shipping: { type: Object, default: {} },  // address
    /* 
            order_shipping: { 
                street,
                city,
                state,
                country
            }
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true }, // shop_order_ids_new (checkout service)  
    order_trackingNumber: { type: String, default: '#00001108052022'}, // tracking don hang 
    order_state: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], 
        default: 'pending'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = model(DOCUMENT_NAME, orderSchema)