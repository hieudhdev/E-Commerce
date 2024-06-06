'use strict'

const Joi = require('joi')
const {
    StringJoiMessages,
    NumberJoiMessages
} = require('../helpers/customJoiMessage')


const mongoDbIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages(StringJoiMessages)

const productsSchema = Joi.object({
    shopId: mongoDbIdSchema,
    productId: mongoDbIdSchema,
    quantity: Joi.number().integer().positive().required().messages(NumberJoiMessages)
}).required()

const addToCartSchema = {
    body: Joi.object({
        userId: Joi.number().required().messages(NumberJoiMessages),
        products: productsSchema
    })
}

const itemProductSchema = Joi.object({
    productId: mongoDbIdSchema,
    quantity: Joi.number().integer().positive().required().messages(NumberJoiMessages),
    old_quantity: Joi.number().integer().positive().optional().messages(NumberJoiMessages)
}).required();

const shopOrderSchema = Joi.object({
    shopId: mongoDbIdSchema,
    item_products: Joi.array().items(itemProductSchema).required()
}).required();

const updateCartSchema = {
    body: Joi.object({
        userId: Joi.number().required().messages(NumberJoiMessages),
        shop_order_ids: Joi.array().items(shopOrderSchema).required()
    })
}

const deleteCartItemSchema = {
    body: Joi.object({
        userId: mongoDbIdSchema,
        productId: mongoDbIdSchema
    })
}

const getCartSchema = {
    query: Joi.object({
        userId: Joi.number().required().messages(NumberJoiMessages),
    })
}

module.exports = {
    addToCartSchema,
    updateCartSchema,
    deleteCartItemSchema,
    getCartSchema
}