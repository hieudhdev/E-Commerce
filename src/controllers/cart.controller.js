'use strict'

const cartService = require('../services/cart.service')
const { SuccessResponse, OK, CREATED } = require("../core/success.response")

class CartController {

    // add a product to cart
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'add products to cart success',
            metadata: await cartService.addToCart( req.body )
        }).send(res)
    }

    // increase/decrease quantity product in cart
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'update cart success',
            metadata: await cartService.addToCartV2( req.body )
        }).send(res)
    }

    // delete cart item
    delele = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete cart item success',
            metadata: await cartService.deleteUserCartItem( req.body )
        }).send(res)
    }

    // get products of an cart
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list products of cart success',
            metadata: await cartService.getListUserCart( req.query )
        }).send(res)
    }

}

module.exports = new CartController()