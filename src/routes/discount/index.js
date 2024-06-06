'use strict'

const express = require('express')
const router = express.Router()
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')
const validate = require('../../middlewares/validate')
const discountValidation = require('../../validation/discount.validation')

// get amount a discount
router.post('/amount', validate(discountValidation.discountAmount), asyncHandler( discountController.getDiscountAmount ))
router.get('/list_product_code', validate(discountValidation.getListProductByDiscount), asyncHandler( discountController.getAllDiscountCodesWithProduct ))

// authentication
router.use(authenticationV2)

router.post('', validate(discountValidation.createDiscount), asyncHandler( discountController.createDiscountCode ))
router.get('', validate(discountValidation.getDiscountByShop), asyncHandler( discountController.getAllDiscountCodes ))


module.exports = router