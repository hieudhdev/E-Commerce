'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

// convert id from client to ObjectId
const convertToObjectId = (id) => {
    return new Types.ObjectId(id)
}

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

// remove key: value if value = undefine or null of an object
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k => {
        if (obj[k] && typeof obj[k] === 'object') removeUndefinedObject(obj[k]);
        else if (obj[k] == null) delete obj[k];
    })

    return obj
}

/*
    Handle obj nested for update product
    const a = {
        b: {
            c: 1,
            d: 1
        }
    }

    db.collection.updateOne({
        `b.c`: 1
        `b.d`: 1
    })
*/
const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach( k => {
        if ( typeof obj[k] === 'object' && !Array.isArray(obj[k]) ) {
            const res = updateNestedObjectParser(obj[k])
            Object.keys(res).forEach( a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })

    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectId
}