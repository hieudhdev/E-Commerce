'use strict'

const discount = require('../discount.model')
const { getSelectData, unGetSelectData } = require('../../utils/index')

const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model 
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find( filter )
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect)) // select() receive an object param
        .lean()

    return documents
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model 
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find( filter )
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select)) // select() receive an object param
        .lean()

    return documents
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect
}