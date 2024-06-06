'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')
const validate = require('../../middlewares/validate')
const accessValidation = require('../../validation/access.validation')

// sign up
router.post('/shop/signup', validate(accessValidation.userSignup), asyncHandler( accessController.signUp ))

// login
router.post('/shop/login', validate(accessValidation.userLogin), asyncHandler( accessController.login ))

// authentication middleware
router.use(authenticationV2)

// logout
router.post('/shop/logout', asyncHandler( accessController.logout ))
router.post('/shop/handlerRefreshToken', asyncHandler( accessController.handlerRefreshToken ))

module.exports = router