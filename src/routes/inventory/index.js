'use strict'

const express = require('express')
const router = express.Router()
const inventoryController = require('../../controllers/inventory.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')

// authentication
router.use(authenticationV2)

router.post('/search/:keySearch', asyncHandler( inventoryController.addStockToInventory ))

module.exports = router