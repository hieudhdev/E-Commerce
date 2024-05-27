'use strict'

const CommentService = require('../services/comment.service')
const { SuccessResponse, OK, CREATED } = require("../helpers/success.response")

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'New comment created',
            metadata: await CommentService.createComment( req.body )
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list comment by parent success',
            metadata: await CommentService.getCommentsByParentId( req.query )
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete comment success',
            metadata: await CommentService.deleteComment( req.query )
        }).send(res)
    }

}   

module.exports = new CommentController()