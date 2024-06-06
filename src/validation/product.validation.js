'use strict'

const Joi = require('joi');
const {
    StringJoiMessages,
    NumberJoiMessages
} = require('../helpers/customJoiMessage')

const mongoId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages(StringJoiMessages)

const searchProduct = {
    params: Joi.string().max(50).required().messages(StringJoiMessages)
}

const getAllProduct = {
    query: Joi.object({
        limit: Joi.number().integer().max(50).required().messages(NumberJoiMessages),
        sort: Joi.string().max(10).required().messages(StringJoiMessages),
        page: Joi.number().integer().required().messages(NumberJoiMessages)
    })
}

const detailProduct = {
    params: Joi.number().required().messages(NumberJoiMessages)
}

const createProduct = {
    body: Joi.object().keys({
        product_name: Joi.string().required().messages(StringJoiMessages),
        product_thumb: Joi.string().required().messages(StringJoiMessages),
        product_description: Joi.string().required().messages(StringJoiMessages),
        product_price: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        product_quantity: Joi.number().integer().min(0).required().messages(NumberJoiMessages),
        product_type: Joi.string().required().messages(StringJoiMessages),
        product_shop: mongoId,
        product_attributes: Joi.object({
            brand: Joi.string().required().messages(StringJoiMessages),
            size: Joi.string().required().messages(StringJoiMessages),
            material: Joi.string().required().messages(StringJoiMessages)
        }).required()
    })
}

const updateProduct = {
    body: Joi.object().keys({
        product_name: Joi.string().messages(StringJoiMessages),
        product_thumb: Joi.string().messages(StringJoiMessages),
        product_description: Joi.string().messages(StringJoiMessages),
        product_price: Joi.number().integer().min(0).messages(NumberJoiMessages),
        product_quantity: Joi.number().integer().min(0).messages(NumberJoiMessages),
        product_type: Joi.string().messages(StringJoiMessages),
        product_shop: mongoId,
        product_attributes: Joi.object({
            brand: Joi.string().messages(StringJoiMessages),
            size: Joi.string().messages(StringJoiMessages),
            material: Joi.string().messages(StringJoiMessages)
        }).required()
    })
}

module.exports = {
    searchProduct,
    getAllProduct,
    detailProduct,
    createProduct,
    updateProduct
}