'use strict'

const express = require('express')
const router = express.Router()
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// get amount a discount
router.post('/amount', asyncHandler( discountController.getDiscountAmount ))
router.get('/list_product_code', asyncHandler( discountController.getAllDiscountCodesWithProduct ))

// authentication
router.use(authenticationV2)

router.post('', asyncHandler( discountController.createDiscountCode ))
router.get('', asyncHandler( discountController.getAllDiscountCodes ))


module.exports = router