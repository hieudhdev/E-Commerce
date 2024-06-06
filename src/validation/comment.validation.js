'use strict'

const Joi = require('joi')
const {
    StringJoiMessages,
    NumberJoiMessages
} = require('../helpers/customJoiMessage')

const mongoId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages(StringJoiMessages)

// add comment
const createComment = {
    body: Joi.object({
        productId: mongoId,
        userId: Joi.number().integer().required().messages(NumberJoiMessages),
        content: Joi.string().required().messages(StringJoiMessages),
        parentCommentId: mongoId,
    })
}

const getListComment = {
    query: Joi.object({
        productId: mongoId,
        parentCommentId: mongoId,
    })
}

const deleteComment = {
    query: Joi.object({
        productId: mongoId,
        commentId: mongoId,
    })
}

module.exports = {
    createComment,
    getListComment,
    deleteComment
}