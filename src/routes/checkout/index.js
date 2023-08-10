'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const checkoutController = require('../../controllers/checkout.controller')

// authentication
// router.use(authenticationV2)

router.post('/review', asyncHandler( checkoutController.checkoutReview ))

module.exports = router