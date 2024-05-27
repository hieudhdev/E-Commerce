'use strict'

const CheckoutService = require('../services/checkout.service')
const { SuccessResponse, OK, CREATED } = require("../helpers/success.response")

class CheckoutController {

    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get checkout review success!',
            metadata: await CheckoutService.checkoutReview( req.body )
        }).send(res)
    }
    
}

module.exports = new CheckoutController()