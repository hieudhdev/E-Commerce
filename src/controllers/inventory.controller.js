'use strict'

const InventoryService = require('../services/inventory.service')
const { SuccessResponse, OK, CREATED } = require("../helpers/success.response")

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'addStockToInventory success',
            metadata: await InventoryService.addStockToInventory( req.body )
        }).send(res)
    }

}

module.exports = new InventoryController()