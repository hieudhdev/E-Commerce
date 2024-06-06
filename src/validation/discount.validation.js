'use strict'

const Joi = require('joi');
const {
    StringJoiMessages,
    NumberJoiMessages
} = require('../helpers/customJoiMessage')

const mongoId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages(StringJoiMessages)

const productSchema = Joi.object({
    productId: mongoId,
    price: Joi.number().integer().required(),
    quantity: Joi.number().integer().required()
})

// get discount amount
const discountAmount = {
    body: Joi.object({
        code: Joi.string().required().messages(StringJoiMessages),
        userId: Joi.string().required().messages(StringJoiMessages),
        shopId: mongoId,
        products: Joi.array().items(productSchema).required()
    })
}

const getListProductByDiscount = {
    query: Joi.object({
        code: Joi.string().required().messages(StringJoiMessages),
        shopId: mongoId,
    })
}

const getDiscountByShop = {
    query: Joi.object({
        page: Joi.number().integer().required().messages(NumberJoiMessages),
        limit: Joi.number().integer().required().messages(NumberJoiMessages),
    })
}

const createDiscount = {
    body: Joi.object({
        name: Joi.string().required().messages(StringJoiMessages),
        description: Joi.string().required().messages(StringJoiMessages),
        type: Joi.string().valid('percentage', 'fixed_amount').required().messages(StringJoiMessages),
        value: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        max_value: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        code: Joi.string().required().messages(StringJoiMessages),
        start_date: Joi.date().iso().required(),
        end_date: Joi.date().iso().required(),
        max_uses: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        uses_count: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        users_used: Joi.array().items(mongoId).required(),
        max_uses_per_user: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        min_order_value: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        create_by: Joi.object().required(),
        is_active: Joi.boolean().required(),
        applies_to: Joi.string().valid('all', 'specific').required().messages(StringJoiMessages),
        product_ids: Joi.array().items(mongoId).required()
    })
}

module.exports = {
    discountAmount,
    getListProductByDiscount,
    getDiscountByShop,
    createDiscount
}