'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// service for all users
router.get('/search/:keySearch', asyncHandler( productController.getListSearchProduct ))
router.get('/:product_id', asyncHandler( productController.findProduct ))

// authentication middleware
router.use(authenticationV2)

// service for shop
router.post('', asyncHandler( productController.createProduct ))
router.post('/publish/:id', asyncHandler( productController.publishProductByShop ))
router.post('/unpublish/:id', asyncHandler( productController.unPublishProductByShop ))

// query
router.get('/drafts/all', asyncHandler( productController.getAllDraftsForShop ))
router.get('/published/all', asyncHandler( productController.getAllPublishForShop ))

module.exports = router