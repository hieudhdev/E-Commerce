'use strict'

const { product, electronic, clothing, furniture } = require('../product.model')
const { Types } = require('mongoose')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({   
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    
    foundShop.isDraft = false
    foundShop.isPublished = true
    
    // foundShop above is an instance of mongoose, so we can use method updateOne() with it
    const { modifiedCount } = await foundShop.updateOne(foundShop)    

    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({   
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    
    foundShop.isDraft = true
    foundShop.isPublished = false
    
    // foundShop above is an instance of mongoose, so we can use method updateOne() with it
    const { modifiedCount } = await foundShop.updateOne(foundShop)    

    return modifiedCount
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'email name -_id')   
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop
}