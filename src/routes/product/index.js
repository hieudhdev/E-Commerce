'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// authentication middleware
router.use(authenticationV2)

// create new product
router.post('', asyncHandler( productController.createProduct ))
router.post('/publish/:id', asyncHandler( productController.publishProductByShop ))

// query
router.get('/drafts/all', asyncHandler( productController.getAllDraftsForShop ))
router.get('/published/all', asyncHandler( productController.getAllPublishForShop ))

module.exports = router