'use strict'

const {mongoose, Schema, Types, model} = require('mongoose')

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

const shopSchema = new Schema ({
    name: {
        type: 'string',
        trim: true,
        maxLength: 150
    },
    email: {
        type: 'string',
        unique: true,
        trim: true
    },
    password: {
        type: 'string',
        require: true
    },
    status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        dafault: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, shopSchema)