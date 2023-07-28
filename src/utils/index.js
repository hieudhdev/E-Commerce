'use strict'

const _ = require('lodash')

// get specific field of a document
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick( fields, object )
}

// convert array => object : ['a', 'b'] => {'a': 1, 'b': 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

module.exports = {
    getInfoData,
    getSelectData
}