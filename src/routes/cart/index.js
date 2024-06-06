'use strict'

const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')
const validate = require('../../middlewares/validate')
const cartValidation = require('../../validation/cart.validation')

// authentication
router.use(authenticationV2)

router.post('', validate(cartValidation.addToCartSchema) ,asyncHandler( cartController.addToCart ))
router.delete('', validate(cartValidation.deleteCartItemSchema), asyncHandler( cartController.delele ))
router.post('/update', validate(cartValidation.updateCartSchema), asyncHandler( cartController.update ))
router.get('', validate(cartValidation.getCartSchema), asyncHandler( cartController.listToCart ))

module.exports = router