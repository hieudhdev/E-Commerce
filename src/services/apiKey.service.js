'use strict'

const apiKeyModel = require('../models/apiKey.model')

const findById = async ( key ) => {
    const objKey = apiKeyModel.findOne({ key, status: true}).lean()
    return objKey
}

module.exports = {
    findById
}