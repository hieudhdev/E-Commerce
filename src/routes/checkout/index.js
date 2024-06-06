'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')
const checkoutController = require('../../controllers/checkout.controller')
const validate = require('../../middlewares/validate')
const checkoutValidation = require('../../validation/checkout.validation') 

// authentication
router.use(authenticationV2)

router.post('/review', validate(checkoutValidation.checkoutReview), asyncHandler( checkoutController.checkoutReview ))

module.exports = router