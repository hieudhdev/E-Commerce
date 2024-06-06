'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')
const validate = require('../../middlewares/validate')
const productValidation = require('../../validation/product.validation')

// service for all users
router.get('/search/:keySearch', asyncHandler( productController.getListSearchProduct ))
router.get('', validate(productValidation.getAllProduct), asyncHandler( productController.findAllProducts ))
router.get('/:product_id', asyncHandler( productController.findProduct ))

// authentication middleware
router.use(authenticationV2)

// service for shop
router.post('', validate(productValidation.createProduct), asyncHandler( productController.createProduct ))
router.patch('/:productId', validate(productValidation.updateProduct), asyncHandler( productController.updateProductByShop ))
router.post('/publish/:id', asyncHandler( productController.publishProductByShop ))
router.post('/unpublish/:id', asyncHandler( productController.unPublishProductByShop ))

// query
router.get('/drafts/all', asyncHandler( productController.getAllDraftsForShop ))
router.get('/published/all', asyncHandler( productController.getAllPublishForShop ))

module.exports = router