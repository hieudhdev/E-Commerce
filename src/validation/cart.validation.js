'use strict'

const Joi = require('joi')

const mongoDbIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()

const productsSchema = Joi.object({
    shopId: mongoDbIdSchema,
    productId: mongoDbIdSchema,
    quantity: Joi.number().integer().positive().required()
}).required()

const addToCartSchema = Joi.object({
    userId: Joi.number().required(),
    products: productsSchema
})

const itemProductSchema = Joi.object({
    productId: mongoDbIdSchema,
    quantity: Joi.number().integer().positive().required(),
    old_quantity: Joi.number().integer().positive().optional()
}).required();

const shopOrderSchema = Joi.object({
    shopId: mongoDbIdSchema,
    item_products: Joi.array().items(itemProductSchema).required()
}).required();

const updateCartSchema = Joi.object({
    userId: Joi.number().required(),
    shop_order_ids: Joi.array().items(shopOrderSchema).required()
})

const deleteCartItemSchema = Joi.object({
    userId: mongoDbIdSchema,
    productId: mongoDbIdSchema
})

const getCartSchema = Joi.object({
    userId: Joi.number().required(),
})

module.exports = {
    addToCartSchema,
    updateCartSchema,
    deleteCartItemSchema,
    getCartSchema
}