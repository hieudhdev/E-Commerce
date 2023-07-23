'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick( fields, object )
}

module.exports = {
    getInfoData
}