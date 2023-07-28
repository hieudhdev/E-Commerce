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

// convert array => object : ['a', 'b'] => {'a': 0, 'b': 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData
}