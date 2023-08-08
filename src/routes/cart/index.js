'use strict'

const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// authentication
router.use(authenticationV2)

router.post('', asyncHandler( cartController.addToCart ))
router.delete('', asyncHandler( cartController.delele ))
router.post('/update', asyncHandler( cartController.update ))
router.get('', asyncHandler( cartController.listToCart ))

module.exports = router