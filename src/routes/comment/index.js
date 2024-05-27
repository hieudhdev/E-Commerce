'use strict'

const express = require('express')
const router = express.Router()
const CommentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')

// authentication
router.use(authenticationV2)

// get amount a discount
router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getCommentsByParentId))
router.delete('', asyncHandler(CommentController.deleteComment)) 

module.exports = router