'use strict'

const express = require('express')
const router = express.Router()
const NotificationController = require('../../controllers/notification.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// authentication
router.use(authenticationV2)

router.get('', asyncHandler(NotificationController.getListNotiByUser))

module.exports = router