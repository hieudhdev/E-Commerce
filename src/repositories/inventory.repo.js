'use strict'

const { convertToObjectId } = require('../helpers')
const inventory = require('../models/inventory.model')
const { Types } = require('mongoose')

const insertInventory = async ({
    productId, shopId, stock, location = 'unkhown'
}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_shopId: shopId,
        inven_location: location
    })
}

const reservationInventory = async ({ productId, quantity, cardId }) => {
    const query = {
        inven_productId: convertToObjectId(productId),
        inven_stock: {$gte: quantity}
    },
    updateSet = {
        $inc: {
            inven_stock: - quantity
        },
        $push: {
            inven_reservation: {
                quantity,
                cardId,
                createOn: new Date()
            }
        }
    },
    options = {
        upsert: true,
        new: true
    }

    return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}