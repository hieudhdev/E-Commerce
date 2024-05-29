'use strict'

const cartService = require('../services/cart.service')
const { SuccessResponse, OK, CREATED } = require("../helpers/success.response")
const { BabRequestError } = require('../helpers/error.response')
const {
    addToCartSchema,
    updateCartSchema,
    deleteCartItemSchema,
    getCartSchema
} = require('../validation/cart.validation')

class CartController {

    // add a product to cart
    addToCart = async (req, res, next) => {
        const { error } = addToCartSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errorMsg = error.details.map(err => err.message);
            throw new BabRequestError( errorMsg )
        }

        new SuccessResponse({
            message: 'add products to cart success',
            metadata: await cartService.addToCart( req.body )
        }).send(res)
    }

    // increase/decrease quantity product in cart
    update = async (req, res, next) => {
        const { error } = deleteCartItemSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errorMsg = error.details.map(err => err.message);
            throw new BabRequestError( errorMsg )
        }

        new SuccessResponse({
            message: 'update cart success',
            metadata: await cartService.addToCartV2( req.body )
        }).send(res)
    }

    // delete cart item
    delele = async (req, res, next) => {
        const { error } = updateCartSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errorMsg = error.details.map(err => err.message);
            throw new BabRequestError( errorMsg )
        }
    
        new SuccessResponse({
            message: 'delete cart item success',
            metadata: await cartService.deleteUserCartItem( req.body )
        }).send(res)
    }

    // get products of an cart
    listToCart = async (req, res, next) => {
        const { error } = getCartSchema.validate(req.query, { abortEarly: false })
        if (error) {
            const errorMsg = error.details.map(err => err.message);
            throw new BabRequestError( errorMsg )
        }
    
        new SuccessResponse({
            message: 'get list products of cart success',
            metadata: await cartService.getListUserCart( req.query )
        }).send(res)
    }

}

module.exports = new CartController()