'use strict'

const express = require('express')
const router = express.Router()
const CommentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../middlewares/checkAuth')
const { authentication, authenticationV2 } = require('../../middlewares/authUtils')
const validate = require('../../middlewares/validate')
const commentValidation = require('../../validation/comment.validation')

// authentication
router.use(authenticationV2)

// get amount a discount
router.post('', validate(commentValidation.createComment), asyncHandler(CommentController.createComment))
router.get('', validate(commentValidation.getListComment), asyncHandler(CommentController.getCommentsByParentId))
router.delete('', validate(commentValidation.deleteComment), asyncHandler(CommentController.deleteComment)) 

module.exports = router