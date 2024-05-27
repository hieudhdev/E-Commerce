'use strict'

const { NotFoundError } = require('../helpers/error.response')
const Comment = require('../models/comment.model')
const { convertToObjectId } = require('../helpers')
const { findProduct } = require('../repositories/product.repo')

/*
    Key service: ConmentService
    + add comment [User/Shop]
    + get a list of comment [User/Shop/Guest]
    + delete a comment [User/Shop/Admin]
*/
// NOTE: NESTED COMMENT ?????

class CommentService {
    
    static async createComment ({ productId, userId, content, parentCommentId = null }) {
        const comment = new Comment({   // creata an instance of mongoose
            comment_productId: productId,   
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        
        let rightValue
        if (parentCommentId) {
            // add a reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent commment not found')

            rightValue = parentComment.comment_right

            // updateMany comment
            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_right: { $gte : rightValue },
            }, {
                $inc : {comment_right : 2}
            })

            await Comment.updateMany({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt : rightValue },
            }, {
                $inc : {comment_left : 2}
            })

        } else {
            // add a new comment (root comment)
            /*
                When we add a new comment (not reply),
                we have to reindex left, right of this comment
            */
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectId(productId)
            }, 'comment_right', {sort : {commment_right : -1}})
        
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()

        return comment
    }

    static async getCommentsByParentId ({productId, parentCommentId = null, limit = 50, skip = 0}) {
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent commment not found')

            const comments = await Comment.find({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt : parentComment.comment_left },
                comment_right: { $lte : parentComment.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        } 

        const comments = await Comment.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments;
    }

    static async deleteComment ({productId, commentId}) {
        const foundProduct = await findProduct({
            product_id: productId 
        })
        if (!foundProduct) throw new NotFoundError('Product not found!')

        // 1. find left right value of delete comment
        const comment = await Comment.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found!')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // 2. find the width for update left, right value after delete comment
        const widthValue = rightValue - leftValue + 1

        // 3. delete comment (included child comment)
        const deleteComments = await Comment.deleteMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })

        // 4. update left, right value for remain comment 
        // (only comment have right > right value or left > right value)
        await Comment.updateMany({
            comment_productId: convertToObjectId(productId),
            comment_right: { $gt: rightValue } 
        }, {
            $inc: { comment_right: -widthValue }
        })

        await Comment.updateMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gt: rightValue } 
        }, {
            $inc: { comment_left: -widthValue }
        })

        return deleteComments
    }

}

module.exports = CommentService