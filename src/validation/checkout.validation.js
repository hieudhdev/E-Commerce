'use strict'

const Joi = require('joi')
const {
    StringJoiMessages,
    NumberJoiMessages
} = require('../helpers/customJoiMessage')

const mongoId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages(StringJoiMessages)

const itemProductSchema = Joi.object({
    productId: mongoId,
    quantity: Joi.number().integer().positive().required().messages(NumberJoiMessages),
    old_quantity: Joi.number().integer().positive().optional().messages(NumberJoiMessages)
}).required();

const shopOrderSchema = Joi.object({
    shopId: mongoId,
    item_products: Joi.array().items(itemProductSchema).required()
}).required();

// checkout
const checkoutReview = {
    body: Joi.object({
        cartId: mongoId,
        userId: mongoId,
        shop_order_ids: Joi.array().items(
            Joi.object({
                shopId: Joi.string().required().messages(StringJoiMessages),
                item_products: Joi.array().items(
                    Joi.object({
                        price: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
                        quantity: Joi.number().integer().min(1).required().messages(NumberJoiMessages),
                        productId: Joi.string().required().messages(StringJoiMessages)
                    })
                ).required()
            })
        ).required()
    })
}

module.exports = {
    checkoutReview
}