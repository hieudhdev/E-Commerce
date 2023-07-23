'use strict'

const {mongoose, Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keyTokenSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    privateKey: {
        type: String,
        require: true
    },
    publicKey: {
        type: String,
        require: true
    },
    refreshTokensUsed: {    // refresh token da duoc su dung
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)
